const LEADS_BACKUP_KEY = 'bbq_leads_backup_v1';
const ARTICLES_STORAGE_KEY = 'bbq_articles_v1';
const MOCK_CLOUD_BUCKET_KEY = 'bbq_mock_gcs_bucket_v1';

const isMockMode = true; // Always in mock mode for image uploads since we don't have Gatsby/GCS configured yet

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const cloudService = {
  async uploadImage(key: string, file: File): Promise<string | null> {
    if (isMockMode) {
      await sleep(800);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const bucket = JSON.parse(localStorage.getItem(MOCK_CLOUD_BUCKET_KEY) || '{}');
          bucket[key] = base64;
          localStorage.setItem(MOCK_CLOUD_BUCKET_KEY, JSON.stringify(bucket));
          resolve(base64);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    }
    return null;
  },

  async saveLead(leadData: any): Promise<boolean> {
    try {
      console.log("Saving Lead:", leadData);

      // Enviar para o nosso Servidor (que fará o proxy para o Google Script e bases de dados externas)
      const response = await fetch('/api/save-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`Server failed to process lead: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Erro ao guardar lead:", error);
      
      // Fallback: Guardar no LocalStorage como backup se o servidor estiver em baixo
      try {
        const backups = JSON.parse(localStorage.getItem(LEADS_BACKUP_KEY) || '[]');
        backups.push({ ...leadData, _offline: true, _retryAt: new Date().toISOString() });
        localStorage.setItem(LEADS_BACKUP_KEY, JSON.stringify(backups));
      } catch (e) {
        console.error("Erro ao criar backup local:", e);
      }
      
      return false;
    }
  },

  async fetchArticles(): Promise<any[]> {
    const saved = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  async saveArticle(article: any): Promise<boolean> {
    const articles = await this.fetchArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index > -1) {
      articles[index] = article;
    } else {
      articles.push(article);
    }
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    return true;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const articles = await this.fetchArticles();
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  async fetchCorporateLeads(): Promise<any[]> {
    try {
      const response = await fetch('/api/leads-corp');
      if (!response.ok) {
        throw new Error(`Failed to fetch corporate leads: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching corporate leads:", error);
      return [];
    }
  },

  async deleteCorporateLead(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/leads-corp/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Failed to delete corporate lead: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error deleting corporate lead:", error);
      return false;
    }
  }
};
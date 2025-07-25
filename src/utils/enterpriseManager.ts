// Enterprise Manager for Forward Horizon - Multi-tenant, Global, Franchise Support

interface Tenant {
  id: string;
  name: string;
  type: 'facility' | 'franchise' | 'enterprise';
  parentId?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'professional' | 'enterprise' | 'franchise';
  features: string[];
  limits: {
    residents: number;
    staff: number;
    storage: number; // GB
    apiCalls: number;
  };
  usage: {
    residents: number;
    staff: number;
    storage: number;
    apiCalls: number;
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
    dateFormat: string;
    customBranding: {
      logo?: string;
      colors: {
        primary: string;
        secondary: string;
        accent: string;
      };
      companyName: string;
    };
  };
  billing: {
    cycle: 'monthly' | 'quarterly' | 'annually';
    amount: number;
    currency: string;
    nextBilling: Date;
    status: 'active' | 'past_due' | 'cancelled';
  };
  createdAt: Date;
  updatedAt: Date;
}

interface FranchiseNetwork {
  id: string;
  name: string;
  ownerId: string;
  headquarters: {
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  };
  facilities: Tenant[];
  standards: {
    branding: boolean;
    policies: boolean;
    training: boolean;
    quality: boolean;
  };
  revenue: {
    total: number;
    shared: number;
    franchisee: number;
  };
  performance: {
    averageOccupancy: number;
    averageRating: number;
    complianceScore: number;
  };
}

interface GlobalSettings {
  supportedLanguages: string[];
  supportedCurrencies: string[];
  supportedTimezones: string[];
  regions: {
    [key: string]: {
      name: string;
      currency: string;
      timezone: string;
      dateFormat: string;
      phoneFormat: string;
      addressFormat: string;
    };
  };
  compliance: {
    [key: string]: {
      name: string;
      requirements: string[];
      enabled: boolean;
    };
  };
}

interface EnterpriseUser {
  id: string;
  tenantId: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'staff' | 'viewer';
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdAt: Date;
}

class EnterpriseManager {
  private static instance: EnterpriseManager;
  private tenants: Map<string, Tenant> = new Map();
  private franchises: Map<string, FranchiseNetwork> = new Map();
  private users: Map<string, EnterpriseUser> = new Map();
  private globalSettings!: GlobalSettings;

  static getInstance(): EnterpriseManager {
    if (!EnterpriseManager.instance) {
      EnterpriseManager.instance = new EnterpriseManager();
    }
    return EnterpriseManager.instance;
  }

  constructor() {
    this.initializeGlobalSettings();
    this.initializeSampleData();
  }

  // Multi-tenant Management
  async createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
    const tenant: Tenant = {
      id: this.generateId(),
      name: tenantData.name || 'New Facility',
      type: tenantData.type || 'facility',
      status: 'active',
      plan: tenantData.plan || 'basic',
      features: this.getDefaultFeatures(tenantData.plan || 'basic'),
      limits: this.getDefaultLimits(tenantData.plan || 'basic'),
      usage: {
        residents: 0,
        staff: 0,
        storage: 0,
        apiCalls: 0
      },
      settings: {
        timezone: tenantData.settings?.timezone || 'America/New_York',
        currency: tenantData.settings?.currency || 'USD',
        language: tenantData.settings?.language || 'en',
        dateFormat: tenantData.settings?.dateFormat || 'MM/DD/YYYY',
        customBranding: {
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#f59e0b'
          },
          companyName: tenantData.name || 'New Facility'
        }
      },
      billing: {
        cycle: 'monthly',
        amount: this.getPlanPrice(tenantData.plan || 'basic'),
        currency: 'USD',
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...tenantData
    };

    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  async getTenant(tenantId: string): Promise<Tenant | null> {
    return this.tenants.get(tenantId) || null;
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const updatedTenant = {
      ...tenant,
      ...updates,
      updatedAt: new Date()
    };

    this.tenants.set(tenantId, updatedTenant);
    return updatedTenant;
  }

  async deleteTenant(tenantId: string): Promise<boolean> {
    return this.tenants.delete(tenantId);
  }

  async listTenants(filters?: {
    type?: string;
    status?: string;
    plan?: string;
    parentId?: string;
  }): Promise<Tenant[]> {
    let tenants = Array.from(this.tenants.values());

    if (filters) {
      if (filters.type) {
        tenants = tenants.filter(t => t.type === filters.type);
      }
      if (filters.status) {
        tenants = tenants.filter(t => t.status === filters.status);
      }
      if (filters.plan) {
        tenants = tenants.filter(t => t.plan === filters.plan);
      }
      if (filters.parentId) {
        tenants = tenants.filter(t => t.parentId === filters.parentId);
      }
    }

    return tenants;
  }

  // Franchise Management
  async createFranchise(franchiseData: Partial<FranchiseNetwork>): Promise<FranchiseNetwork> {
    const franchise: FranchiseNetwork = {
      id: this.generateId(),
      name: franchiseData.name || 'New Franchise Network',
      ownerId: franchiseData.ownerId || '',
      headquarters: {
        address: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        email: ''
      },
      facilities: [],
      standards: {
        branding: true,
        policies: true,
        training: true,
        quality: true
      },
      revenue: {
        total: 0,
        shared: 0,
        franchisee: 0
      },
      performance: {
        averageOccupancy: 0,
        averageRating: 0,
        complianceScore: 0
      },
      ...franchiseData
    };

    this.franchises.set(franchise.id, franchise);
    return franchise;
  }

  async addFacilityToFranchise(franchiseId: string, facilityId: string): Promise<boolean> {
    const franchise = this.franchises.get(franchiseId);
    const facility = this.tenants.get(facilityId);

    if (!franchise || !facility) return false;

    facility.parentId = franchiseId;
    facility.type = 'franchise';
    franchise.facilities.push(facility);

    this.franchises.set(franchiseId, franchise);
    this.tenants.set(facilityId, facility);

    return true;
  }

  async getFranchisePerformance(franchiseId: string): Promise<any> {
    const franchise = this.franchises.get(franchiseId);
    if (!franchise) return null;

    // Calculate franchise performance metrics
    const totalRevenue = franchise.facilities.reduce((sum, facility) => {
      return sum + (facility.billing.amount || 0);
    }, 0);

    const averageOccupancy = franchise.facilities.reduce((sum, facility) => {
      return sum + (facility.usage.residents / facility.limits.residents);
    }, 0) / franchise.facilities.length;

    return {
      totalRevenue,
      averageOccupancy,
      facilityCount: franchise.facilities.length,
      activeFacilities: franchise.facilities.filter(f => f.status === 'active').length
    };
  }

  // Global Support
  async getSupportedRegions(): Promise<any[]> {
    return Object.entries(this.globalSettings.regions).map(([code, region]) => ({
      code,
      ...region
    }));
  }

  async getComplianceRequirements(region: string): Promise<any> {
    return this.globalSettings.compliance[region] || null;
  }

  async formatForRegion(data: any, region: string): Promise<any> {
    const regionSettings = this.globalSettings.regions[region];
    if (!regionSettings) return data;

    // Format currency, dates, phone numbers, etc. for the region
    return {
      ...data,
      currency: regionSettings.currency,
      timezone: regionSettings.timezone,
      dateFormat: regionSettings.dateFormat
    };
  }

  // User Management
  async createUser(userData: Partial<EnterpriseUser>): Promise<EnterpriseUser> {
    const user: EnterpriseUser = {
      id: this.generateId(),
      tenantId: userData.tenantId || '',
      email: userData.email || '',
      role: userData.role || 'staff',
      permissions: this.getDefaultPermissions(userData.role || 'staff'),
      status: 'active',
      lastLogin: new Date(),
      createdAt: new Date(),
      ...userData
    };

    this.users.set(user.id, user);
    return user;
  }

  async getUser(userId: string): Promise<EnterpriseUser | null> {
    return this.users.get(userId) || null;
  }

  async updateUser(userId: string, updates: Partial<EnterpriseUser>): Promise<EnterpriseUser | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async listUsers(tenantId: string): Promise<EnterpriseUser[]> {
    return Array.from(this.users.values()).filter(user => user.tenantId === tenantId);
  }

  // Usage and Billing
  async trackUsage(tenantId: string, usageType: keyof Tenant['usage'], amount: number): Promise<void> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return;

    tenant.usage[usageType] += amount;
    tenant.updatedAt = new Date();

    // Check if usage exceeds limits
    if (tenant.usage[usageType] > tenant.limits[usageType]) {
      await this.handleUsageLimitExceeded(tenant, usageType);
    }

    this.tenants.set(tenantId, tenant);
  }

  async getBillingReport(tenantId: string): Promise<any> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    return {
      tenant: tenant.name,
      plan: tenant.plan,
      billing: tenant.billing,
      usage: tenant.usage,
      limits: tenant.limits,
      overages: this.calculateOverages(tenant)
    };
  }

  // Analytics and Reporting
  async getEnterpriseAnalytics(): Promise<any> {
    const tenants = Array.from(this.tenants.values());
    const franchises = Array.from(this.franchises.values());

    return {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.status === 'active').length,
      totalRevenue: tenants.reduce((sum, t) => sum + t.billing.amount, 0),
      planDistribution: this.getPlanDistribution(tenants),
      franchiseNetworks: franchises.length,
      globalReach: this.getGlobalReach(tenants)
    };
  }

  async getTenantAnalytics(tenantId: string): Promise<any> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    return {
      usage: tenant.usage,
      limits: tenant.limits,
      utilization: this.calculateUtilization(tenant),
      billing: tenant.billing,
      performance: await this.calculateTenantPerformance(tenantId)
    };
  }

  // Helper Methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultFeatures(plan: string): string[] {
    const features = {
      basic: ['residents', 'payments', 'reports'],
      professional: ['residents', 'payments', 'reports', 'analytics', 'integrations'],
      enterprise: ['residents', 'payments', 'reports', 'analytics', 'integrations', 'ai', 'api'],
      franchise: ['residents', 'payments', 'reports', 'analytics', 'integrations', 'ai', 'api', 'franchise_management']
    };
    return features[plan as keyof typeof features] || features.basic;
  }

  private getDefaultLimits(plan: string): Tenant['limits'] {
    const limits = {
      basic: { residents: 50, staff: 20, storage: 10, apiCalls: 1000 },
      professional: { residents: 200, staff: 50, storage: 50, apiCalls: 5000 },
      enterprise: { residents: 1000, staff: 200, storage: 200, apiCalls: 25000 },
      franchise: { residents: 5000, staff: 500, storage: 500, apiCalls: 100000 }
    };
    return limits[plan as keyof typeof limits] || limits.basic;
  }

  private getPlanPrice(plan: string): number {
    const prices = {
      basic: 99,
      professional: 299,
      enterprise: 999,
      franchise: 1999
    };
    return prices[plan as keyof typeof prices] || 99;
  }

  private getDefaultPermissions(role: string): string[] {
    const permissions = {
      super_admin: ['*'],
      admin: ['read', 'write', 'delete', 'manage_users'],
      manager: ['read', 'write'],
      staff: ['read', 'write'],
      viewer: ['read']
    };
    return permissions[role as keyof typeof permissions] || ['read'];
  }

  private async handleUsageLimitExceeded(tenant: Tenant, usageType: string): Promise<void> {
    // Send notification, upgrade suggestion, etc.
    console.log(`Usage limit exceeded for tenant ${tenant.id}: ${usageType}`);
  }

  private calculateOverages(tenant: Tenant): any {
    const overages: any = {};
    Object.keys(tenant.usage).forEach(key => {
      const usageKey = key as keyof Tenant['usage'];
      if (tenant.usage[usageKey] > tenant.limits[usageKey]) {
        overages[key] = tenant.usage[usageKey] - tenant.limits[usageKey];
      }
    });
    return overages;
  }

  private getPlanDistribution(tenants: Tenant[]): any {
    const distribution: any = {};
    tenants.forEach(tenant => {
      distribution[tenant.plan] = (distribution[tenant.plan] || 0) + 1;
    });
    return distribution;
  }

  private getGlobalReach(tenants: Tenant[]): any {
    const regions: any = {};
    tenants.forEach(tenant => {
      const region = tenant.settings.timezone.split('/')[0];
      regions[region] = (regions[region] || 0) + 1;
    });
    return regions;
  }

  private calculateUtilization(tenant: Tenant): any {
    return {
      residents: (tenant.usage.residents / tenant.limits.residents) * 100,
      staff: (tenant.usage.staff / tenant.limits.staff) * 100,
      storage: (tenant.usage.storage / tenant.limits.storage) * 100,
      apiCalls: (tenant.usage.apiCalls / tenant.limits.apiCalls) * 100
    };
  }

  private async calculateTenantPerformance(tenantId: string): Promise<any> {
    // This would calculate actual performance metrics from the database
    return {
      occupancyRate: 85 + Math.random() * 10,
      satisfactionScore: 4.2 + Math.random() * 0.6,
      complianceScore: 95 + Math.random() * 5
    };
  }

  private initializeGlobalSettings(): void {
    this.globalSettings = {
      supportedLanguages: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko'],
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
      supportedTimezones: ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo'],
      regions: {
        'US': {
          name: 'United States',
          currency: 'USD',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          phoneFormat: '+1 (XXX) XXX-XXXX',
          addressFormat: 'Street, City, State ZIP'
        },
        'CA': {
          name: 'Canada',
          currency: 'CAD',
          timezone: 'America/Toronto',
          dateFormat: 'YYYY-MM-DD',
          phoneFormat: '+1 (XXX) XXX-XXXX',
          addressFormat: 'Street, City, Province Postal Code'
        },
        'UK': {
          name: 'United Kingdom',
          currency: 'GBP',
          timezone: 'Europe/London',
          dateFormat: 'DD/MM/YYYY',
          phoneFormat: '+44 XXXX XXXXXX',
          addressFormat: 'Street, City, Postcode'
        }
      },
      compliance: {
        'US': {
          name: 'HIPAA',
          requirements: ['data_encryption', 'access_controls', 'audit_logs'],
          enabled: true
        },
        'EU': {
          name: 'GDPR',
          requirements: ['data_protection', 'consent_management', 'right_to_forget'],
          enabled: true
        }
      }
    };
  }

  private initializeSampleData(): void {
    // Create sample tenants
    this.createTenant({
      name: 'Sunset Gardens',
      type: 'facility',
      plan: 'professional',
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        customBranding: {
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#f59e0b'
          },
          companyName: 'Sunset Gardens'
        }
      }
    });

    this.createTenant({
      name: 'Golden Years Care',
      type: 'facility',
      plan: 'enterprise',
      settings: {
        timezone: 'America/Los_Angeles',
        currency: 'USD',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        customBranding: {
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#f59e0b'
          },
          companyName: 'Golden Years Care'
        }
      }
    });

    // Create sample franchise
    this.createFranchise({
      name: 'Comfort Care Network',
      ownerId: 'owner-1',
      headquarters: {
        address: '123 Main St',
        city: 'Chicago',
        state: 'IL',
        country: 'US',
        phone: '+1 (555) 123-4567',
        email: 'info@comfortcare.com'
      }
    });
  }
}

// Export singleton instance
export const enterpriseManager = EnterpriseManager.getInstance();

// Export types
export type { Tenant, FranchiseNetwork, GlobalSettings, EnterpriseUser }; 
/** Configuration types for YAML config files */

export interface ShieldConfig {
  readonly authentication?: AuthenticationConfig;
  readonly rules?: RulesConfig;
  readonly pipeline?: PipelineConfig;
}

export interface AuthenticationConfig {
  readonly login_type: 'form' | 'sso' | 'api' | 'basic';
  readonly login_url: string;
  readonly credentials: {
    readonly username: string;
    readonly password: string;
    readonly totp_secret?: string;
  };
  readonly login_flow?: readonly string[];
  readonly success_condition?: {
    readonly type: 'url_contains' | 'element_present' | 'url_equals_exactly' | 'text_contains';
    readonly value: string;
  };
}

export interface RulesConfig {
  readonly avoid?: readonly RuleItem[];
  readonly focus?: readonly RuleItem[];
}

export interface RuleItem {
  readonly description: string;
  readonly type: 'path' | 'subdomain' | 'domain' | 'method' | 'header' | 'parameter';
  readonly url_path?: string;
  readonly subdomain?: string;
  readonly domain?: string;
  readonly method?: string;
  readonly header?: string;
  readonly parameter?: string;
}

export interface PipelineConfig {
  readonly retry_preset?: 'default' | 'subscription';
  readonly max_concurrent_pipelines?: number;
}

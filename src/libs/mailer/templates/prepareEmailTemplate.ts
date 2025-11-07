import { readFileSync, existsSync, promises } from 'node:fs'
import { join } from 'node:path'
import { OMBARO_SITE_NAME, OMBARO_SITE_URL } from '../constant';

interface EmailConfig {
  fullLogo?: string;
  siteName: string;
  siteUrl: string;
}

const emailConfig: EmailConfig = {
  fullLogo: "https://ramaera.com/ramanew.png",
  siteName: OMBARO_SITE_NAME,
  siteUrl: OMBARO_SITE_URL
};

const replaceAllOccurrences = (
  str: string,
  search: string | RegExp,
  replace: string
): string => {
  if (str == null || typeof str !== 'string') {
    return "";
  }
  
  if (typeof search === 'string') {
    return str.split(search).join(replace);
  }
  
  return str.replace(search, replace);
}

const isErrnoException = (err: unknown): err is NodeJS.ErrnoException => {
  return err instanceof Error && "code" in err;
}

/// Cache for template
let templateCache: string | null = null;

export  const  prepareEmailTemplate = async (
  processedTemplate: string,
  processedSubject: string
): Promise<string> => {
  const templatePath = join(__dirname, '', 'generalTemplate.html');

  try {
    /// Use cached template if available
    if (!templateCache) {
      templateCache = await promises.readFile(templatePath, "utf-8");
      
      if (!templateCache.trim()) {
        throw new Error("Email template is empty");
      }
    }

    const replacements = {
      "%SITE_URL%": emailConfig.siteUrl,
      "%HEADER%": emailConfig.fullLogo
        ? `<img src="${emailConfig.fullLogo}" alt="${emailConfig.siteName}" style="max-height:96px; display:block; margin:0 auto;" />`
        : `<h1 style="text-align:center; margin:0; padding:20px 0;">${emailConfig.siteName}</h1>`,
      "%MESSAGE%": processedTemplate,
      "%SUBJECT%": processedSubject,
      "%FOOTER%": emailConfig.siteName,
      "%YEAR%": new Date().getFullYear().toString(),
      "%CURRENT_DATE%": new Date().toLocaleDateString(), 
    };

    return Object.entries(replacements).reduce(
      (acc, [key, value]) => replaceAllOccurrences(acc, key, value),
      templateCache
    );

  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      throw new Error(`Email template not found at: ${templatePath}`);
    }
    
    if (error instanceof Error) {
      throw new Error(`Failed to prepare email template: ${error.message}`);
    }
    
    throw new Error("Unknown error occurred while preparing email template");
  }
}

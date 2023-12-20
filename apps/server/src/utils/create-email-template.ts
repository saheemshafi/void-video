import ejs from 'ejs';
import path from 'path';
import fs from 'fs/promises';

const createEmailTemplate = async (publicTemplatePath: string, data: any) => {
  try {
    if (!publicTemplatePath) {
      throw new Error('Template path required.');
    }
    const templateFile = await fs.readFile(
      path.join('public', 'emails', publicTemplatePath),
      {
        encoding: 'utf-8',
      }
    );

    const template = ejs.compile(templateFile);
    return template(data);
  } catch (error) {
    console.log('CREATE EMAIL TEMPLATE: Failed to compile template.', error);
    throw new Error(error instanceof Error ? error.message : '');
  }
};

export default createEmailTemplate;

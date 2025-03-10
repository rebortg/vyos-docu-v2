import { spawn } from 'child_process';
import path from 'path';
import type { Plugin } from '@docusaurus/types';

export default function generateDocsPlugin(context: any, options: any): Plugin<void> {
  return {
    name: 'docusaurus-plugin-generate-docs',
    async loadContent(): Promise<void> {
      return new Promise((resolve, reject) => {
        const pythonScript = spawn('python3', [
          path.join(context.siteDir, 'scripts/generate_docs.py')
        ]);

        pythonScript.stdout.on('data', (data: Buffer) => {
          console.log(`Python output: ${data.toString()}`);
        });

        pythonScript.stderr.on('data', (data: Buffer) => {
          console.error(`Python error: ${data.toString()}`);
        });

        pythonScript.on('close', (code: number | null) => {
          if (code !== 0) {
            reject(`Python script exited with code ${code}`);
          } else {
            resolve();
          }
        });
      });
    }
  };
} 
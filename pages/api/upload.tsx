import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../lib/jsonwebtoken';

export const config = {
  api: {
    bodyParser: false,
  },
};

const getUniqueFilename = (dir:any, originalName:any) => {
  const ext = path.extname(originalName);
  let counter = 1;
  let newFilename = `img_${counter}${ext}`;
  while (fs.existsSync(path.join(dir, newFilename))) {
    counter++;
    newFilename = `img_${counter}${ext}`;
  }
  return newFilename;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/form-data')) {
      res.status(415).json({ message: 'Tipo de conteúdo inválido. Por favor, envie como multipart/form-data.' });
      return;
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({ uploadDir, keepExtensions: true });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        res.status(500).json({ message: 'Algo deu errado com o upload' });
        return;
      }

      const token = fields.token.toString();
      const decryptToken = verifyToken(token);

      const fileKey = Object.keys(files)[0];
      const fileArray = files[fileKey];
      const filesToProcess = Array.isArray(fileArray) ? fileArray : [fileArray];

      if (filesToProcess.length === 0) {
        res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
        return;
      }

      if (!decryptToken) {
        filesToProcess.forEach((file) => fs.unlinkSync(file.filepath));
        res.status(200).json({ message: 'Token Invalido' });
        return;
      }

      const fileTypes = /jpeg|jpg|png|svg/;
      const results = [];

      for (const file of filesToProcess) {
        const extname = fileTypes.test(path.extname(file.originalFilename || '').toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
          const newFilename = getUniqueFilename(uploadDir, file.originalFilename);
          const newFilePath = path.join(uploadDir, newFilename);

          try {
            await fs.promises.rename(file.filepath, newFilePath);
            results.push({ filepath: newFilePath, filename: newFilename });
          } catch (renameErr) {
            res.status(500).json({ message: 'Erro ao salvar o arquivo.' });
            return;
          }
        } else {
          await fs.promises.unlink(file.filepath);
          res.status(400).json({ message: 'Tipo de arquivo não suportado.' });
          return;
        }
      }

      res.status(200).json({ message: 'Upload bem sucedido', data: results });
    });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
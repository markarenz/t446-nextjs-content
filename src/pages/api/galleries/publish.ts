import { unstable_getServerSession } from 'next-auth/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { publishGalleries } from '../../../utility/db/queries/galleries';

// GALLERIES PUBLISH
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403);
  } else {
    try {
      await publishGalleries();
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('ALERT:CREATE', err);
      return res.status(500).json({ success: false });
    }
  }
}

export default handler;

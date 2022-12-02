import { unstable_getServerSession } from 'next-auth/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { getIsAdmin } from '../../../helpers';
import { publishPages } from '../../../utility/db/queries/pages';

// PAGES PUBLISH
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !getIsAdmin(session)) {
    return res.status(403);
  } else {
    try {
      await publishPages();
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('PAGES:PUBLISH', err);
      return res.status(500).json({ success: false });
    }
  }
}

export default handler;

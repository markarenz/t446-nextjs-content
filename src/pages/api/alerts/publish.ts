import { unstable_getServerSession } from 'next-auth/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { getIsAdmin } from '../../../helpers';
import { publishAlerts } from '../../../utility/db/queries/alerts';

// ALERTS PUBLISH
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !getIsAdmin(session)) {
    return res.status(403);
  } else {
    try {
      await publishAlerts();
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('ALERT:PUBLISH', err);
      return res.status(500).json({ success: false });
    }
  }
}

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';
import { getScore, updateScore } from '../../utils/score';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const score = await getScore(req.user.email);
        res.status(200).json({ score });
    } else if (req.method === 'POST') {
        const { score } = req.body;
        await updateScore(req.user.email, score);
        res.status(200).end();
    }
}

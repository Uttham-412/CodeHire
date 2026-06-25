// Interview controller
const interviewService = require('../services/firestore/interviewService');
const { firestore } = require('../config/firebase');

// Helper to generate random alphanumeric string of length 6-8
function generateJoiningId(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Ensure uniqueness of joiningId
async function getUniqueJoiningId() {
  const col = firestore.collection('interviews');
  let attempts = 0;
  while (attempts < 5) {
    const id = generateJoiningId(6 + Math.floor(Math.random() * 3)); // 6-8 chars
    const snapshot = await col.where('joiningId', '==', id).get();
    if (snapshot.empty) return id;
    attempts++;
  }
  // fallback after several attempts
  return generateJoiningId(8);
}

module.exports = {
  async createInterview(req, res, next) {
    try {
      const required = [
        'interviewerId',
        'interviewerName',
        'candidateId',
        'candidateName',
        'candidateEmail',
        'title',
        'scheduledDate',
        'duration',
        'programmingLanguage',
        'codingQuestions',
        'aptitudeEnabled',
        'hrRoundEnabled'
      ];
      const missing = required.filter((field) => req.body[field] === undefined || req.body[field] === null);
      if (missing.length) {
        return res.status(400).json({ success: false, error: `Missing required fields: ${missing.join(', ')}` });
      }

      const joiningId = await getUniqueJoiningId();
      const joinLink = `http://localhost:5173/room/${joiningId}`;

      const interviewData = {
        ...req.body,
        joiningId,
        joinLink,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const created = await interviewService.create(interviewData);
      // interviewId is the document id (created.id)
      const interview = { interviewId: created.id, ...created };
      return res.status(201).json({ success: true, interview });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/interviews - fetch all interviews sorted by scheduledDate
  async getInterviews(req, res, next) {
    try {
      const interviews = await interviewService.getAll();
      // Ensure graceful handling of empty collection
      const sorted = (Array.isArray(interviews) ? interviews : []).sort((a, b) => {
        const dateA = new Date(a.scheduledDate);
        const dateB = new Date(b.scheduledDate);
        return dateA - dateB;
      });
      return res.status(200).json({ success: true, interviews: sorted });
    } catch (err) {
      next(err);
    }
  }
};

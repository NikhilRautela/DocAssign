const KEYWORDS = {
  'Cardiologist': ['ecg', 'chest pain', 'blood pressure', 'cardiac', 'heart', 'bp'],
  'Dermatologist': ['skin', 'rash', 'allergy', 'hair', 'infection', 'itch'],
  'Orthopedic': ['bone', 'joint', 'fracture', 'knee', 'back pain', 'x-ray'],
  'General Physician': ['fever', 'cold', 'cough', 'weakness', 'fatigue', 'headache'],
}

function fallbackClassify(transcript) {
  const lower = transcript.toLowerCase()
  let best = { category: 'General Physician', score: 0, keywords: [] }
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    const matched = words.filter(w => lower.includes(w))
    if (matched.length > best.score) best = { category: cat, score: matched.length, keywords: matched }
  }
  return {
    suggestedCategory: best.category,
    confidence: Math.min(0.5 + best.score * 0.1, 0.95),
    urgency: 'MEDIUM',
    reason: `Matched keywords: ${best.keywords.join(', ')}`,
    keywords: best.keywords,
    source: 'FALLBACK_RULE_ENGINE'
  }
}

async function analyzeTranscript(transcript) {
  try {
    const response = await fetch(`${process.env.NVIDIA_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{
          role: 'user',
          content: `Analyze this medical report and return ONLY a JSON object with these fields: suggestedCategory (one of: General Physician, Cardiologist, Dermatologist, Orthopedic), confidence (0-1), urgency (LOW/MEDIUM/HIGH), reason (short string), keywords (array of strings). Do NOT diagnose or recommend medicine. Report: "${transcript}"`
        }],
        max_tokens: 300,
        temperature: 0.1
      })
    })
    const data = await response.json()
    const text = data.choices[0].message.content
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0])
    return { ...json, source: 'AI' }
  } catch (e) {
    return fallbackClassify(transcript)
  }
}

module.exports = { analyzeTranscript, fallbackClassify }
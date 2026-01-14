// Claude API Integration for PM Simulator

export async function generateAIFeedback(weekNumber, weekTitle, optionId, optionTitle, metrics) {
  
  // Get API key from environment variable
  const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
  
  // If no API key, return fallback feedback immediately
  if (!CLAUDE_API_KEY) {
    return getFallbackFeedback(weekNumber);
  }
  
  const prompt = `You are analyzing a Project Manager's decision in a realistic simulation.

Context:
- Week ${weekNumber}/12: "${weekTitle}"
- Decision made: Option ${optionId} - "${optionTitle}"
- Current metrics after decision:
  * Client Trust: ${metrics.clientTrust}/100
  * Team Mood: ${metrics.teamMood}/100
  * Tech Debt: ${metrics.techDebt}/100 (higher = worse)
  * Timeline Risk: ${metrics.timelineRisk}/100 (higher = worse)

Provide realistic, grounded PM feedback in 2-3 short paragraphs (150-200 words total):

1. What this decision accomplished (immediate benefit)
2. What hidden cost or trade-off was created
3. Alternative perspective or what experienced PM would consider

Rules:
- NO teaching tone ("you should have...")
- NO generic advice ("communication is key...")
- Speak like a experienced PM reflecting on real project
- Emotional, honest, adult language
- Mirror reality, don't judge
- Reference specific project context (team, timeline, tech debt)

Write naturally, as if you lived through this project.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status);
      return getFallbackFeedback(weekNumber);
    }

    const data = await response.json();
    return data.content[0].text;
    
  } catch (error) {
    console.error('Claude API Error:', error);
    return getFallbackFeedback(weekNumber);
  }
}

// Fallback feedback when API unavailable
function getFallbackFeedback(weekNumber) {
  const fallbacks = [
    `This decision moved the project forward, but like all choices, it came with trade-offs.\n\nThe immediate benefit was clear, but you've created some downstream effects that will compound over the coming weeks. Every "yes" to speed is a "no" to something else — usually stability or team capacity.\n\nAn experienced PM would weigh whether this trade-off aligns with what matters most at Week ${weekNumber} of 12. Sometimes the right decision still hurts.`,
    
    `You made a call under pressure. That's the job.\n\nThe team will feel the impact of this choice differently than the client will. What looks like progress on one front often creates friction on another. The key isn't avoiding trade-offs — it's being honest about which ones you're making.\n\nAt Week ${weekNumber}, you're building momentum. But momentum has mass, and changing direction gets harder the further you go.`,
    
    `In the moment, this probably felt like the only reasonable choice. And maybe it was.\n\nBut reasonable decisions still have consequences. The team's capacity isn't infinite. Tech debt isn't just code — it's all the shortcuts and compromises that seem fine today but compound tomorrow.\n\nYou're managing multiple truths at once: what the client needs, what the team can sustain, what the timeline demands. Week ${weekNumber} is when these truths start to conflict.`
  ];
  
  return fallbacks[weekNumber % fallbacks.length];
}

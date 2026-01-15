// Claude API Integration for PM Simulator

export async function generateAIFeedback(weekNumber, weekTitle, optionId, optionTitle, metrics, weekData, selectedOption, oldMetrics) {
  
  // Format team signals
  const signalsText = weekData.signals
    .map(s => `- ${s.from}: "${s.message}"`)
    .join('\n');
  
  // Format other options (ones NOT chosen)
  const otherOptions = weekData.options
    .filter(opt => opt.id !== optionId)
    .map(opt => `${opt.id}) ${opt.title}\n   → ${opt.consequences.immediate}`)
    .join('\n\n');
  
  // Calculate deltas
  const formatDelta = (value) => {
    if (value > 0) return `+${value}`;
    if (value < 0) return `${value}`;
    return '0';
  };
  
  const deltas = {
    clientTrust: metrics.clientTrust - oldMetrics.clientTrust,
    teamMood: metrics.teamMood - oldMetrics.teamMood,
    techDebt: metrics.techDebt - oldMetrics.techDebt,
    timelineRisk: metrics.timelineRisk - oldMetrics.timelineRisk
  };
  
  const prompt = `You are a seasoned PM reflecting on a real project decision.

WEEK ${weekNumber}/12: "${weekTitle}"

SITUATION:
${weekData.context}

TEAM SIGNALS:
${signalsText}

YOUR DECISION:
Option ${optionId}: "${selectedOption.title}"
→ ${selectedOption.consequences.immediate}

WHAT YOU DIDN'T CHOOSE:
${otherOptions}

IMPACT:
- Client Trust: ${oldMetrics.clientTrust} → ${metrics.clientTrust} (${formatDelta(deltas.clientTrust)})
- Team Mood: ${oldMetrics.teamMood} → ${metrics.teamMood} (${formatDelta(deltas.teamMood)})
- Tech Debt: ${oldMetrics.techDebt} → ${metrics.techDebt} (${formatDelta(deltas.techDebt)})
- Timeline Risk: ${oldMetrics.timelineRisk} → ${metrics.timelineRisk} (${formatDelta(deltas.timelineRisk)})

Provide grounded feedback in 2-3 paragraphs (150-200 words total):

1. What this decision accomplished (why it worked or didn't)
2. What trade-off or hidden cost exists (what you gave up vs other options)
3. One insight an experienced PM would notice at Week ${weekNumber}/12

Rules:
- Reference SPECIFIC details from this week's situation
- Compare to the options you DIDN'T choose
- Tie to metrics changes (explain WHY mood/debt/risk changed)
- NO generic advice ("communication is key")
- Real, grounded, experienced PM voice
- Speak as if you lived through this exact project

Write naturally and honestly.`;

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

// Generate AI-powered Final Review based on all decisions
export async function generateFinalReview(decisionHistory, metrics, scenarioData) {
  
  // Build decision summary
  const decisionSummary = decisionHistory.map((decision, index) => {
    const weekData = scenarioData.weeks[decision.week - 1];
    const selectedOption = weekData.options.find(opt => opt.id === decision.optionId);
    return `Week ${decision.week} (${weekData.title}): Chose Option ${decision.optionId} - ${selectedOption.title}`;
  }).join('\n');
  
  const prompt = `You are writing the final retrospective for a 12-week PM simulation project.

THE PROJECT:
${scenarioData.projectBrief.context}

THE 12 DECISIONS MADE:
${decisionSummary}

FINAL METRICS:
- Client Trust: ${metrics.clientTrust}/100
- Team Mood: ${metrics.teamMood}/100
- Tech Debt: ${metrics.techDebt}/100 (higher = worse)
- Timeline Risk: ${metrics.timelineRisk}/100 (higher = worse)

Write a powerful, honest final reflection (300-400 words) that:

1. **What Happened** (100 words): Describe the project outcome based on final metrics. Did they succeed? At what cost? Be specific about the demo, funding, and what was real vs what was shown.

2. **The Pattern** (150 words): Analyze the decision pattern across 12 weeks. What trade-offs were consistently made? How did early decisions compound into later problems? Reference specific weeks where trajectory changed.

3. **The Reality** (100 words): The truth that doesn't go in retrospectives. What did this cost the team? What expectations are now set for the next phase? What can't be given to everyone?

Rules:
- Write like someone who lived through this exact project
- Reference specific metrics to tell the story (e.g., "65 trust but 45 mood tells you...")
- NO generic PM advice
- NO teaching tone
- Be honest, sometimes brutal
- Make it personal and real
- Use short paragraphs and punchy sentences
- End with the uncomfortable truth

Do NOT use headers or markdown. Write in flowing prose, separated by blank lines between sections.`;

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        temperature: 0.8,
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
      return getFallbackFinalReview();
    }

    const data = await response.json();
    return data.content[0].text;
    
  } catch (error) {
    console.error('Claude API Error:', error);
    return getFallbackFinalReview();
  }
}

// Fallback final review when API unavailable
function getFallbackFinalReview() {
  return `The MVP launched. The demo worked. Series B funding secured.

But the product you showed wasn't the product in production. You demonstrated core flows under controlled conditions. Investors saw potential, not reality.

The team delivered the impossible. They worked nights. They skipped quality steps. They built workarounds instead of solutions. They said yes when they meant "maybe if we're lucky."

The hidden cost: technical debt that will take 3 months to unwind. A team that trusts you but is exhausted. A codebase that works but nobody fully understands anymore. A founder who thinks you can do this again, faster.

You didn't fail. But you didn't win cleanly either.

You made twelve decisions. Most were reasonable in isolation. But decisions compound. Each trade-off borrowed from the future. Each "yes" to speed was a "no" to stability.

The team doesn't blame you. They delivered what you asked. They trust you. But trust is a resource too. And you've spent it.

Next phase starts Monday. David expects acceleration. The team expects rest. The codebase expects refactoring. You can't give everyone what they need.

And that's the truth nobody puts in the retrospective.`;
}

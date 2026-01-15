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
  
  const prompt = `Ти досвідчений PM, який аналізує рішення в реальному проєкті.

ТИЖДЕНЬ ${weekNumber}/12: "${weekTitle}"

СИТУАЦІЯ:
${weekData.context}

СИГНАЛИ ВІД КОМАНДИ:
${signalsText}

ТВОЄ РІШЕННЯ:
Опція ${optionId}: "${selectedOption.title}"
→ ${selectedOption.consequences.immediate}

ЩО ТИ НЕ ОБРАВ:
${otherOptions}

ВПЛИВ НА МЕТРИКИ:
- Довіра клієнта: ${oldMetrics.clientTrust} → ${metrics.clientTrust} (${formatDelta(deltas.clientTrust)})
- Настрій команди: ${oldMetrics.teamMood} → ${metrics.teamMood} (${formatDelta(deltas.teamMood)})
- Техборг: ${oldMetrics.techDebt} → ${metrics.techDebt} (${formatDelta(deltas.techDebt)})
- Ризик дедлайну: ${oldMetrics.timelineRisk} → ${metrics.timelineRisk} (${formatDelta(deltas.timelineRisk)})

Напиши чесний фідбек у 2-3 абзаци (150-200 слів):

1. Що дало це рішення (чому спрацювало або ні)
2. Який компроміс або прихована ціна (що віддав порівняно з іншими опціями)
3. Один інсайт, який помітив би досвідчений PM на тижні ${weekNumber}/12

Правила:
- Згадуй КОНКРЕТНІ деталі з ситуації цього тижня
- Порівнюй з опціями, які ти НЕ обрав
- Прив'язуй до змін метрик (поясни ЧОМУ настрій/борг/ризик змінився)
- БЕЗ загальних порад ("комунікація — це ключ")
- Реальний, приземлений голос досвідченого PM
- Пиши так, ніби ти сам пережив цей проєкт
- Природна розмовна українська, як говорять PM в офісах

Пиши природно і чесно.`;

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
  
  const prompt = `Ти пишеш фінальну ретроспективу для 12-тижневого проєкту PM-симулятора.

ПРОЄКТ:
${scenarioData.projectBrief.context}

12 РІШЕНЬ, ЯКІ ПРИЙНЯВ PM:
${decisionSummary}

ФІНАЛЬНІ МЕТРИКИ:
- Довіра клієнта: ${metrics.clientTrust}/100
- Настрій команди: ${metrics.teamMood}/100
- Техборг: ${metrics.techDebt}/100 (вище = гірше)
- Ризик дедлайну: ${metrics.timelineRisk}/100 (вище = гірше)

Напиши потужну, чесну фінальну ретроспективу (300-400 слів):

1. **Що сталося** (100 слів): Опиши результат проєкту на основі фінальних метрик. Вийшло? Якою ціною? Будь конкретним про демо, фандінг, що було реальним а що показухою.

2. **Паттерн** (150 слів): Проаналізуй паттерн рішень протягом 12 тижнів. Які компроміси повторювалися? Як ранні рішення переросли в пізніші проблеми? Згадай конкретні тижні, де траєкторія змінилася.

3. **Реальність** (100 слів): Правда, яка не потрапить в ретроспективу. Скільки це коштувало команді? Які очікування тепер встановлені на наступну фазу? Що неможливо дати всім?

Правила:
- Пиши як хтось, хто пережив саме цей проєкт
- Використовуй конкретні метрики для розповіді (наприклад, "65 довіри але 45 настрою каже тобі...")
- БЕЗ загальних PM-порад
- БЕЗ повчального тону
- Будь чесним, інколи брутальним
- Зроби це персональним і реальним
- Використовуй короткі абзаци і влучні речення
- Закінчи некомфортною правдою

НЕ використовуй заголовки чи markdown. Пиши плавною прозою, розділяй секції порожніми рядками.`;

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

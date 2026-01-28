// Tier section: groups quests by tier with a gentle description

const TIER_META = {
  1: {
    label: '🌱 Seeds — Everyday Kindness',
    description: 'Low effort, low pressure, habit-forming actions.'
  },
  2: {
    label: '🌿 Growth — Community & Care',
    description: 'Actions that ask for intention, planning, or vulnerability.'
  },
  3: {
    label: '🌳 Stewardship — High Impact',
    description: 'Commitments that involve leadership or sustained effort.'
  }
}

export function createTierSection(tierNumber, questsForTier, renderQuestCard) {
  const tier = document.createElement('section')
  tier.className = 'tier'

  const meta = TIER_META[tierNumber]

  const header = document.createElement('header')
  header.className = 'tier__header'

  const title = document.createElement('h2')
  title.className = 'tier__title'
  title.textContent = meta?.label ?? `Tier ${tierNumber}`

  const desc = document.createElement('p')
  desc.className = 'tier__description'
  desc.textContent = meta?.description ?? ''

  header.appendChild(title)
  header.appendChild(desc)

  const list = document.createElement('div')
  list.className = 'tier__quests'

  questsForTier.forEach((q) => {
    list.appendChild(renderQuestCard(q))
  })

  tier.appendChild(header)
  tier.appendChild(list)

  return tier
}


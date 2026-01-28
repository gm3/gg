// Small header that summarizes overall progress in a friendly way

function formatCopy(totalCompleted) {
  if (totalCompleted === 0) {
    return 'This is here when you’re ready.'
  }
  if (totalCompleted === 1) {
    return 'You’ve logged 1 act of kindness.'
  }
  return `You’ve logged ${totalCompleted} acts of kindness.`
}

export function createProgressSummary(totalCompleted, totalQuests) {
  const wrapper = document.createElement('section')
  wrapper.className = 'summary'

  const title = document.createElement('h1')
  title.className = 'summary__title'
  title.textContent = 'Humanity Skill Tree'

  const line = document.createElement('p')
  line.className = 'summary__line'

  const percentage = totalQuests
    ? Math.round((totalCompleted / totalQuests) * 100)
    : 0

  line.textContent = `${formatCopy(totalCompleted)} (${percentage}% of your tree so far.)`

  wrapper.appendChild(title)
  wrapper.appendChild(line)

  return wrapper
}


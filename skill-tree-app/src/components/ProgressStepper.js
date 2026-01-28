// Progress Stepper component - shows progress over time
// Similar to React Bits Stepper but vanilla JS

export function createProgressStepper(totalCompleted, totalQuests) {
  const container = document.createElement('div')
  container.className = 'progress-stepper'
  
  const percentage = totalQuests ? Math.round((totalCompleted / totalQuests) * 100) : 0
  
  // Create milestone steps
  const milestones = [0, 25, 50, 75, 100]
  
  const stepperBar = document.createElement('div')
  stepperBar.className = 'progress-stepper__bar'
  
  milestones.forEach((milestone, index) => {
    const step = document.createElement('div')
    step.className = 'progress-stepper__step'
    
    const isReached = percentage >= milestone
    const isCurrent = percentage >= milestone && (index === milestones.length - 1 || percentage < milestones[index + 1])
    
    if (isReached) {
      step.classList.add('progress-stepper__step--reached')
    }
    if (isCurrent) {
      step.classList.add('progress-stepper__step--current')
    }
    
    const stepCircle = document.createElement('div')
    stepCircle.className = 'progress-stepper__circle'
    if (isReached) {
      stepCircle.textContent = '✓'
    } else {
      stepCircle.textContent = milestone
    }
    
    const stepLabel = document.createElement('div')
    stepLabel.className = 'progress-stepper__label'
    stepLabel.textContent = `${milestone}%`
    
    step.appendChild(stepCircle)
    step.appendChild(stepLabel)
    
    // Add connector line between steps
    if (index < milestones.length - 1) {
      const connector = document.createElement('div')
      connector.className = 'progress-stepper__connector'
      if (isReached && percentage >= milestones[index + 1]) {
        connector.classList.add('progress-stepper__connector--filled')
      }
      step.appendChild(connector)
    }
    
    stepperBar.appendChild(step)
  })
  
  const stepperInfo = document.createElement('div')
  stepperInfo.className = 'progress-stepper__info'
  stepperInfo.textContent = `${totalCompleted} of ${totalQuests} nodes completed`
  
  container.appendChild(stepperBar)
  container.appendChild(stepperInfo)
  
  return container
}

interface ReflectionCardProps { onSelect: (value: string) => void; selected?: string }

export function ReflectionCard({ onSelect, selected }: ReflectionCardProps) {
  const choices = ['I look for easy multiples first.', 'I break off a big chunk.', 'Multiplication helps me divide.', 'I still feel unsure.']
  return (
    <section className="reflection-card">
      <span className="section-label">A SMALL PAUSE</span>
      <h2>What are you noticing?</h2>
      <p>There is no right answer here. Just notice what is beginning to feel useful.</p>
      <div className="reflection-options">
        {choices.map((choice) => <button key={choice} className={selected === choice ? 'selected' : ''} onClick={() => onSelect(choice)}>{choice}<span>↗</span></button>)}
      </div>
    </section>
  )
}

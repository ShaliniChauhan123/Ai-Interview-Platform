function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function Card({ as: Component = 'div', className, ...props }) {
  return <Component className={cx(className)} {...props} />
}

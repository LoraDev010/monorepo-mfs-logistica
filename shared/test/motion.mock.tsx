import React from 'react'

type MotionProps = Record<string, unknown>

function stripMotionProps(props: MotionProps) {
  const {
    initial, animate, exit, transition, whileHover, whileTap, whileFocus,
    layout, layoutId, variants, custom, onAnimationStart, onAnimationComplete,
    ...rest
  } = props
  return rest
}

const createMotionElement = (tag: string) =>
  React.forwardRef<HTMLElement, MotionProps & { children?: React.ReactNode }>(
    ({ children, ...props }, ref) =>
      React.createElement(tag, { ...stripMotionProps(props), ref }, children as React.ReactNode)
  )

export const motion = {
  div: createMotionElement('div'),
  span: createMotionElement('span'),
  button: createMotionElement('button'),
  article: createMotionElement('article'),
  section: createMotionElement('section'),
  nav: createMotionElement('nav'),
  ul: createMotionElement('ul'),
  li: createMotionElement('li'),
  h1: createMotionElement('h1'),
  h2: createMotionElement('h2'),
  p: createMotionElement('p'),
  a: createMotionElement('a'),
  form: createMotionElement('form'),
}

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>

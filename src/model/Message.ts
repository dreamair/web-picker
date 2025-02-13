
export interface Message {
  action: string
  payload?: any
  isOptional?: boolean
}

export interface PageAction {
  type: string
  label: string
  description?: string
  singleField?: boolean
}

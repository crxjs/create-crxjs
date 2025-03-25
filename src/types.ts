type ColorFunc = (str: string | number) => string

export interface Framework {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}

export interface FrameworkVariant {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
}

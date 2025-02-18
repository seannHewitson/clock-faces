import { useTheme } from '@mui/styles'
import { getRGBA, HexToRgba } from 'functions/color'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { HexColorPicker, RgbaColorPicker } from 'react-colorful'

import { Theme } from 'theme'

import useStyles from './styles'
import { ColorInputProps } from './types'

const ColorInput = ({ label, value, inputChange }: ColorInputProps) => {
  const [color, setColor] = useState<string>(value ?? '')
  const [isRGB, setIsRGB] = useState<boolean>(
    value ? !value.startsWith('#') : false
  )
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => setIsVisible(!isVisible)
  const handleLabelClick = () => inputRef?.current?.focus()
  const handleToggle = () => {
    if (color.startsWith('#')) {
      const { r, g, b, a } = HexToRgba(color)
      setColor(`rgba(${r}, ${g}, ${b}, ${a})`)
    } else {
      const { r, g, b } = getRGBA(color)
      const f = (n: number) => n.toString(16).padStart(2, '0')
      setColor(`#${f(r)}${f(g)}${f(b)}`)
    }
    setIsRGB(!isRGB)
  }

  const handleChange = (e: any) => {
    const value =
      typeof e === 'string'
        ? e
        : e.r && e.g && e.b
        ? `rgba(${e.r}, ${e.g}, ${e.b}, ${e.a})`
        : e?.target?.value || ''
    setColor(value)
    inputChange(value)
  }

  const theme: Theme = useTheme()
  const classes = useStyles(theme)

  useEffect(() => {
    const closePicker = (e: any) =>
      isVisible &&
      !containerRef.current?.contains(e.target) &&
      setIsVisible(false)

    window.addEventListener('click', closePicker)

    return () => {
      window.removeEventListener('click', closePicker)
    }
  }, [isVisible, setIsVisible])

  return (
    <div className={classes.container}>
      <input ref={inputRef} value={color} onChange={handleChange} />
      <label onClick={handleLabelClick}>{label}</label>
      <div className={classes.preview} onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fillOpacity=".1"
        >
          <path d="M8 0h8v8H8zM0 8h8v8H0z" />
        </svg>
        {color && (
          <div
            className={classes.color}
            style={{ backgroundColor: color }}
          ></div>
        )}
      </div>
      {color !== '' && (
        <svg
          viewBox="0 0 1024 1024"
          className={classes.svg}
          onClick={handleToggle}
        >
          <path d="M1010.6 479.7L736.4 205.4a45.7 45.7 0 10-64.7 64.6l242 242L671.7 754a45.7 45.7 0 1064.7 64.6l274.1-274.2a45.6 45.6 0 000-64.6M0 511.9c0-11.7 4.5-23.4 13.4-32.3l274.1-274.2a45.7 45.7 0 1164.7 64.6L110.4 512l241.9 241.9a45.7 45.7 0 01-64.7 64.6L13.4 544.2C4.4 535.3 0 523.6 0 512"></path>
        </svg>
      )}
      {isVisible && (
        <div className={classes.selectorWrapper}>
          <div className={classes.indicator}></div>
          <div className={classes.selector} ref={containerRef}>
            {isRGB ? (
              <RgbaColorPicker
                color={
                  color.startsWith('#') ? HexToRgba(color) : getRGBA(color)
                }
                onChange={handleChange}
              />
            ) : (
              <HexColorPicker color={color} onChange={handleChange} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// const _ColorInput = ({ label, value }: ColorInputProps) => {
//   const [color, setColor] = useState<string>()
//   const [hex, setHex] = useState<string>('#000000')
//   const [isVisible, setIsVisible] = useState<boolean>(false)
//   const [isRGB, setIsRGB] = useState<boolean>(false)
//   const [rgba, setRgba] = useState<RGBA>({ r: 0, g: 0, b: 0, a: 0 })

//   const containerRef = useRef<HTMLDivElement>(null)
//   const inputRef = useRef<HTMLInputElement>(null)

//   const handleHEX = (value: string) => {
//     setColor(value)
//     setHex(value)
//     const rgb = HexToRgba(value)
//     setRgba({ ...rgb, a: rgba.a })
//     setHsla({ ...RgbaToHsla(rgb), a: rgba.a })
//   }
//   const handleHSLA = ({ h, s, l, a }: any) => {
//     const value = `hsla(${h}, ${s}%, ${l}%, ${a})`
//     setColor(value)
//     setHsla({ h, s, l, a })
//     const hslaHex = HslaToHex({ h, s, l, a })
//     setHex(hslaHex)
//     const rgb = HexToRgba(hslaHex)
//     setRgba({ ...rgb, a })
//   }
//   const handleRGBA = ({ r, g, b, a }: any) => {
//     const value = `rgba(${r}, ${g}, ${b}, ${a})`
//     setColor(value)
//     setRgba({ r, g, b, a })
//     const rgbHsla = RgbaToHsla({ r, g, b, a })
//     setHsla(rgbHsla)
//     setHex(HslaToHex(rgbHsla))
//   }

//   const handleClick = () => setIsVisible(!isVisible)

//   const handleInputChange = ({ target: { value } }: any) => {
//     if (color === hex) {
//       setHex(value)
//       const rgb = {
//         ...HexToRgba(value),
//         a: rgba.a,
//       }
//       setRgba(rgb)
//       setHsla(RgbaToHsla(rgb))
//     } else if (color?.replace(/ /g, '').startsWith('rgb')) {
//       const rgb = getRGBA(value)
//     }
//     setColor(value)
//   }

//   const handleLabelClick = () => inputRef?.current?.focus()

//   const handleToggle = () => {
//     const { a, h, l, s } = hsla
//     const { b, g, r } = rgba
//     const rgb = `rgba(${r}, ${g}, ${b}, ${a})`
//     setColor(
//       color === hex
//         ? rgb
//         : color === rgb
//         ? `hsla(${h}, ${s}%, ${l}%, ${a})`
//         : hex
//     )
//   }

//   const theme: Theme = useTheme()
//   const classes = useStyles(theme)

//   useEffect(() => {
//     const closePicker = (e: any) =>
//       isVisible &&
//       !containerRef.current?.contains(e.target) &&
//       setIsVisible(false)

//     window.addEventListener('click', closePicker)

//     return () => {
//       window.removeEventListener('click', closePicker)
//     }
//   }, [isVisible, setIsVisible])

//   return (
//     <div className={classes.container}>
//       <input ref={inputRef} value={color} onChange={handleInputChange} />
//       <label onClick={handleLabelClick}>{label}</label>
//       <div className={classes.preview} onClick={handleClick}>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="16"
//           height="16"
//           fillOpacity=".1"
//         >
//           <path d="M8 0h8v8H8zM0 8h8v8H0z" />
//         </svg>
//         {color && (
//           <div
//             className={classes.color}
//             style={{ backgroundColor: color }}
//           ></div>
//         )}
//       </div>
//       {color !== '' && (
//         <svg
//           viewBox="0 0 1024 1024"
//           className={classes.svg}
//           onClick={handleToggle}
//         >
//           <path d="M1010.6 479.7L736.4 205.4a45.7 45.7 0 10-64.7 64.6l242 242L671.7 754a45.7 45.7 0 1064.7 64.6l274.1-274.2a45.6 45.6 0 000-64.6M0 511.9c0-11.7 4.5-23.4 13.4-32.3l274.1-274.2a45.7 45.7 0 1164.7 64.6L110.4 512l241.9 241.9a45.7 45.7 0 01-64.7 64.6L13.4 544.2C4.4 535.3 0 523.6 0 512"></path>
//         </svg>
//       )}
//       {isVisible && (
//         <div className={classes.selectorWrapper}>
//           <div className={classes.indicator}></div>
//           <div className={classes.selector} ref={containerRef}>
//             {color === hex ? (
//               <HexColorPicker color={color} onChange={handleHEX} />
//             ) : color === `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` ? (
//               <RgbaColorPicker color={rgba} onChange={handleRGBA} />
//             ) : (
//               <HslaColorPicker color={hsla} onChange={handleHSLA} />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

export default ColorInput

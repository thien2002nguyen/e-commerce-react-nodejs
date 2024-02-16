import icons from './icons'
const { AiFillStar, AiOutlineStar } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()
export const renderStartFromNumber = (number, size) => {
    if (!Number(number)) {
        return
    }
    const numberStar = Math.floor(number)
    const star = []
    for (let i = 0; i < +numberStar; ++i) {
        star.push(<AiFillStar key={i} color='orange' size={size || 16} />)
    }
    for (let i = 5; i > +numberStar; --i) {
        star.push(<AiOutlineStar key={i} color='orange' size={size || 16} />)
    }
    return star
}
export const secondsToHsm = (d) => {
    d = Number(d) / 1000
    const h = Math.floor(d / 3600)
    const m = Math.floor(d % 3600 / 60)
    const s = Math.floor(d % 60)
    return ({ h, m, s })
};

export const validate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)
    for (let array of formatPayload) {
        if (array[1].trim() === '') {
            invalids++
            setInvalidFields(prev => [...prev, { name: array[0], mes: 'Require this field' }])
        }
    }
    for (let array of formatPayload) {
        switch (array[0]) {
            case 'email':
                const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if (!array[1].toLowerCase().match(regex)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: array[0], mes: 'Email invalid' }])
                }
                break
            case 'password':
                if (array[1].length < 6) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: array[0], mes: 'Password mininum 6 character' }])
                }
                break
            default:
                break
        }
    }
    return invalids
}

export const generateRange = (start, end) => {
    const length = end + 1 - start
    return Array.from({ length }, (_, index) => start + index)
}
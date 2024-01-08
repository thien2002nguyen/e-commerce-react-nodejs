import icons from './icons'
const { AiFillStar, AiOutlineStar } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()
export const renderStartFromNumber = (number, size) => {
    if (!Number(number)) {
        return
    }
    const star = []
    for (let i = 0; i < +number; ++i) {
        star.push(<AiFillStar key={i} color='orange' size={size || 16} />)
    }
    for (let i = 5; i > +number; --i) {
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

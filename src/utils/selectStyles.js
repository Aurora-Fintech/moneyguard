// Centralized react-select styles used across forms
const selectStyles = {
  container: (base) => ({ ...base, width: '100%' }),
  control: (base, state) => ({
    ...base,
    minHeight: 44,
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    borderBottom: `2px solid rgba(255,255,255,${state.isFocused ? 1 : 0.3})`,
    borderRadius: 0,
    cursor: 'pointer',
  }),
  valueContainer: (b) => ({ ...b, padding: '4px 0 8px 0' }),
  placeholder: (b) => ({
    ...b,
    color: 'var(--font-color-white-60)',
    fontFamily: 'var(--font-family-base)',
  }),
  singleValue: (b) => ({
    ...b,
    color: 'var(--font-color-white)',
    fontFamily: 'var(--font-family-base)',
  }),
  indicatorsContainer: (b) => ({ ...b, color: 'var(--font-color-white)' }),
  dropdownIndicator: (b, s) => ({
    ...b,
    transition: 'transform .2s ease',
    transform: s.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none',
  }),
  menuPortal: (b) => ({ ...b, zIndex: 10000 }),
  menu: (b) => ({
    ...b,
    background: 'var(--dropdown-color-gradient)',
    borderRadius: 16,
    boxShadow: '0 12px 24px rgba(0,0,0,.35)',
    overflow: 'hidden',
    backdropFilter: 'blur(6px)',
  }),
  menuList: (b) => ({ ...b, padding: 8, maxHeight: 240 }),
  option: (base, state) => {
    const isHover = state.isFocused && !state.isSelected;
    return {
      ...base,
      borderRadius: 12,
      color: isHover ? '#FF868D' : 'var(--font-color-white)',
      background: state.isSelected
        ? 'linear-gradient(96.76deg,#ffc727 -16.42%,#9e40ba 97.04%,#7000ff 150.71%)'
        : isHover
        ? 'rgba(255, 134, 141, 0.18)'
        : 'transparent',
      cursor: 'pointer',
    }
  },
  noOptionsMessage: (b) => ({ ...b, color: 'var(--font-grey)' }),
}

export default selectStyles


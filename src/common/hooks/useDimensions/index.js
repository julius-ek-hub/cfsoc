import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function useDimension() {
  const theme = useTheme();

  const useSize = (key, type) => useMediaQuery(theme.breakpoints[type](key));

  const results = (type) => ({
    xsm: useSize('xs', type),
    sm: useSize('sm', type),
    md: useSize('md', type),
    lg: useSize('lg', type),
    xlg: useSize('xlg', type),
  });

  return {
    up: results('up'),
    down: results('down'),
    only: results('only'),
    not: results('not'),
    t: theme,
  };
}

export default useDimension;

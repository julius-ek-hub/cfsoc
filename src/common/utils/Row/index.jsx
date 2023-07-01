import PropTypes from 'prop-types';

import {
    Box,
    BoxProps,
    SxProps,
} from "@mui/material";

import useDimension from "../../../hooks/useDimensions";
import Text from "../Text";

/**
 * @type { BoxProps & {
 * 'sx-xsm': SxProps,
 * 'sx-sm': SxProps,
 * 'sx-md': SxProps,
 * 'sx-lg': SxProps,
 * 'sx-xlg': SxProps
 * }
 * }
 */

export let RowProps;

/**
 * @param {typeof RowProps} props 
 */

function Row(props) {
    const { noTrailingSpace, children, columnGap, gap, sx: _sx, header, footer, col, ...rest } = props;

    const { up } = useDimension();

    let numOfColumns = col;
    let sx = _sx;

    Object.keys(up).forEach(size => {
        if (up[size]) {
            rest[`col-${size}`] && (numOfColumns = rest[`col-${size}`]);
            rest[`sx-${size}`] && (sx = rest[`sx-${size}`]);
        }
    });

    const noc = Math.abs(Number(numOfColumns || 1));

    let cgValue = 0, cgUnit = 'px';

    let cg = columnGap || gap;

    if (cg) {
        cg = String(cg).toLowerCase();
        const cgMatch = cg.match(/[0-9]+/i);

        !cgMatch && console.warn('Invalid value for columnGap or gap props. Must be a number with units else defaults to 0px');

        cgValue = (cgMatch || [])[0] || '0';
        const unit = cg.split(cgValue)[1];
        cgUnit = unit || 'px';
        !unit && console.warn('Must provide a unit for columnGap or gap props else defaults to px');
    }

    const childrenWidth = 100 / (noc === 0 ? 1 : noc);

    return (
        <Box {...rest} sx={{
            ...sx,
            gap,
            columnGap: cgValue + cgUnit,
            display: 'flex',
            flexWrap: 'wrap',
            '&>*:not(.header, .footer)': {
                width: `calc(${childrenWidth}%  - ${(((100 - childrenWidth) / 100) * cgValue) + cgUnit})`,
                ...(noTrailingSpace && { flexGrow: 1 }),
            },
            '&>*:is(.header, .footer)': {
                flexGrow: 1,
                width: '100%'
            }
        }}
        >
            {header && <Box className="header">{typeof header === 'string' ? <Text>{header}</Text> : header}</Box>}
            {children}
            {footer && <Box className="footer">{typeof footer === 'string' ? <Text>{footer}</Text> : footer}</Box>}
        </Box>
    );
}

Row.propTypes = {
    /** 
     * With this prop set to true, if the last row does not have as many columns as the 
     * previous rows, then the available columns stretch out to fill the remaining gap
     */
    noTrailingSpace: PropTypes.bool,

    /** Placed at the top of the `Row` and is not affected by screen size */
    header: PropTypes.node,

    /** Placed at the bottom of the `Row` and is not affected by screen size */
    footer: PropTypes.node,

    /** Default number of columns for all screen sizes, defaults to 1*/
    col: PropTypes.number,

    /** Number of columns for extra-small screen sizes, defaults to value fo `col`*/
    'col-xsm': PropTypes.number,

    /** Number of columns for small screen sizes, defaults to value fo `col`*/
    'col-sm': PropTypes.number,

    /** Number of columns for medium screen sizes, defaults to value fo `col`*/
    'col-md': PropTypes.number,

    /** Number of columns for large screen sizes, defaults to value fo `col`*/
    'col-lg': PropTypes.number,

    /** Number of columns for extra-large screen sizes, defaults to value fo `col`*/
    'col-xlg': PropTypes.number,
}

Row.defaultProps = {
    noTrailingSpace: false,
    header: null,
    footer: null,
    col: 1,
}

export default Row;
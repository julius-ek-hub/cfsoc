import {
    Typography,
    TypographyProps
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

import React from 'react';

/**
 * @param {{alpha: Number, ellipsis: Boolean} & TypographyProps} props 
 */

function Text(props) {
    const { palette: { mode, ...palette } } = useTheme();
    const { alpha: a = 0.9, ellipsis, sx, ...rest } = props;

    const color = rest.color || 'text.primary';

    const colorCheck = color.split('.');
    const _palette = palette[color] || {};
    let finalColor = (colorCheck[0] === 'text' ? palette.text[colorCheck[1]] : (_palette[colorCheck[1] || mode] || _palette.main)) || color;

    return (
        <Typography sx={{
            ...(ellipsis && {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }),
            ...sx,
            color: alpha(finalColor, a)
        }} {...rest}>
            {rest.children}
        </Typography>
    );
}

export default Text;
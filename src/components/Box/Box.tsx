/*! Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. */
import '../../yamui';
import * as React from 'react';
import { NestableBaseComponentProps } from '../../util/BaseComponent/props';
import Block, { GutterSize } from '../Block';
import { join } from '../../util/classNames';
import { getClassNames } from './Box.styles';

export interface BoxProps extends NestableBaseComponentProps {
  onClick?: (() => void);
}

/**
 * A Box is a div with a border and fixed padding. It also has `display: relative` so you can
 * absolutely-position elements like a close button. Boxes will primarily be used for card views.
 */
export default class Box extends React.Component<BoxProps> {
  public render() {
    const { children, onClick, className } = this.props;
    const classNames = getClassNames({ hasOnClick: !!onClick });
    const rootClassNames = join(['y-box', classNames.root, className]);

    return (
      <div className={rootClassNames} onClick={onClick} role={onClick ? 'button' : undefined}>
        <Block className={classNames.inner} padding={GutterSize.SMALL}>
          {children}
        </Block>
      </div>
    );
  }
}

/*! Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. */
import '../../yamui';
import * as React from 'react';
import autobind from 'core-decorators/lib/autobind';
import { ContainerQuery as ReactContainerQuery } from 'react-container-query';
import { Props } from 'react-container-query/lib/interfaces';

export interface ContainerQueryProps {
  /**
   * An object with named query keys mapped to min/max height and width number values. Example:
   * {
   *    small: {
   *      maxWidth: 500,
   *    },
   *    large: {
   *      minWidth: 501,
   *    },
   * }
   */
  query: Props['query'];

  /**
   * An initial size to render at in the brief period of time while the component is first rendered
   * but the query has not yet been evaluated.
   */
  initialSize?: Props['initialSize'];

  /**
   * A render prop which receives the key of the active query.
   */
  renderAt: (activeQuery?: string) => JSX.Element;
}

interface EvaluatedQuery {
  [key: string]: boolean;
}

const getActiveQueryKey = (evaluatedQuery: EvaluatedQuery): string | undefined => {
  const keys = Object.keys(evaluatedQuery);
  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < keys.length; i++) {
    if (evaluatedQuery[keys[i]] === true) {
      return keys[i];
    }
  }
};

/**
 * ContainerQuery allows for conditional rendering based on the component's height or width.
 * Rather than rendering children, pass a `renderWithQuery`
 */
export default class ContainerQuery extends React.Component<ContainerQueryProps> {
  public render() {
    const { query, initialSize } = this.props;
    return (
      <ReactContainerQuery query={query} initialSize={initialSize} children={this.renderSelected} />
    );
  }

  @autobind
  private renderSelected(evaluatedQuery: EvaluatedQuery) {
    return this.props.renderAt(getActiveQueryKey(evaluatedQuery));
  }
}

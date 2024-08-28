---
# Sidenav top-level section
# should be the same for all markdown files
section: extensions
subsection: Data view
# Sidenav secondary level section
# should be the same for all markdown files
id: Layout
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
source: react
# If you use typescript, the name of the interface to display props for
# These are found through the sourceProps function provided in patternfly-docs.source.js
sortValue: 2
propComponents: ['DataView']
sourceLink: https://github.com/patternfly/react-data-view/blob/main/packages/module/patternfly-docs/content/extensions/data-view/examples/Layout/Layout.md
---
import { useMemo } from 'react';
import { useDataViewPagination, useDataViewSelection } from '@patternfly/react-data-view/dist/dynamic/Hooks';
import { BulkSelect, BulkSelectValue } from '@patternfly/react-component-groups/dist/dynamic/BulkSelect';
import DataView from '@patternfly/react-data-view/dist/dynamic/DataView';
import DataViewToolbar from '@patternfly/react-data-view/dist/dynamic/DataViewToolbar';
import DataViewTable from '@patternfly/react-data-view/dist/dynamic/DataViewTable';

The **data view** component renders record data in a configured layout.

### Layout example

Data view is expected to consist of header, data part and footer stacked below each other and passed as `children`.

```js file="./AbstractLayoutExample.tsx"

```

### Predefined layout components

You can make use of the predefined layout components to display a default header and footer. See [data view toolbar](/extensions/data-view/components#dataviewtoolbar) for more information 

```js file="./PredefinedLayoutExample.tsx"

```

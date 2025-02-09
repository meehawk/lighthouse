/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import fs from 'fs';
import {SidebarHeader, SidebarSummary} from '../../src/sidebar/sidebar';
import {render} from '@testing-library/preact';
import {FunctionComponent} from 'preact';
import {FlowResultContext} from '../../src/util';

const flowResult = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../../lighthouse-core/test/fixtures/fraggle-rock/reports/sample-lhrs.json`,
    'utf-8'
  )
);

let mockLocation: URL;
let wrapper: FunctionComponent;

beforeEach(() => {
  mockLocation = new URL('file:///Users/example/report.html');
  Object.defineProperty(window, 'location', {
    get: () => mockLocation,
  });
  wrapper = ({children}) => (
    <FlowResultContext.Provider value={flowResult}>{children}</FlowResultContext.Provider>
  );
});

describe('SidebarHeader', () => {
  it('renders title content', async () => {
    const title = 'Lighthouse flow report';
    const date = '2021-08-03T18:28:13.296Z';
    const root = render(<SidebarHeader title={title} date={date}/>, {wrapper});

    await expect(root.findByText(title)).resolves.toBeTruthy();
    await expect(root.findByText('Aug 3, 2021, 6:28 PM UTC')).resolves.toBeTruthy();
  });
});

describe('SidebarSummary', () => {
  it('highlighted by default', async () => {
    const root = render(<SidebarSummary/>, {wrapper});
    const link = await root.findByRole('link') as HTMLAnchorElement;

    expect(link.href).toEqual('file:///Users/example/report.html#');
    expect(link.classList).toContain('Sidebar--current');
  });
});

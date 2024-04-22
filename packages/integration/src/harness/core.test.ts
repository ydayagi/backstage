/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { HarnessIntegrationConfig } from './config';
import {
  getHarnessEditContentsUrl,
  getHarnessFileContentsUrl,
  getHarnessRequestOptions,
} from './core';

describe('Harness code core', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  describe('getHarnessFileContentsUrl', () => {
    it('can create an url from arguments', () => {
      const config: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        getHarnessFileContentsUrl(
          config,
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
        ),
      ).toEqual(
        'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/+/content/all-apis.yaml?routingId=accountId&include_commit=false&ref=refMain',
      );
    });
  });

  describe('getHarnessEditContentsUrl', () => {
    it('can create an url from arguments', () => {
      const config: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        getHarnessEditContentsUrl(
          config,
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/edit/refMain/~/all-apis.yaml',
        ),
      ).toEqual(
        'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/+/edit/all-apis.yaml',
      );
    });
  });

  describe('getGerritRequestOptions', () => {
    it('adds token header when only a token is specified', () => {
      const authRequest: HarnessIntegrationConfig = {
        host: 'gerrit.com',
        token: 'P',
      };
      const anonymousRequest: HarnessIntegrationConfig = {
        host: 'gerrit.com',
      };
      expect(
        (getHarnessRequestOptions(authRequest).headers as any).Authorization,
      ).toEqual('Bearer P');
      expect(
        getHarnessRequestOptions(anonymousRequest).headers,
      ).toBeUndefined();
    });

    it('adds basic auth when apikey and token are specified', () => {
      const authRequest: HarnessIntegrationConfig = {
        host: 'gerrit.com',
        token: 'P',
        apiKey: 'a',
      };

      expect(
        (getHarnessRequestOptions(authRequest).headers as any)['x-api-key'],
      ).toEqual('a');
    });
  });
});

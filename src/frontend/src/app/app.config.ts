import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { onError } from '@apollo/client/link/error';
import { from, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { environment } from '../environments/environment';
import { DataModule } from '../lib/data/data.module';

import '@angular/common/locales/global/de';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    provideApollo(() => {
      const http = new BatchHttpLink({
        uri: environment.graphql.uri,
        credentials: 'include',
        fetchOptions: {
          method: 'POST'
        },
        headers: {
          'X-Batch': 'true'
        },
        batchInterval: 200,
        batchMax: 10
      });

      const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        }

        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      });

      return {
        cache: new InMemoryCache(),
        link: from([
          errorLink,
          http
        ])
      };
    }),
    importProvidersFrom(
      DataModule.forRoot()
    ),
    {
      provide: LOCALE_ID,
      useValue: 'de'
    }
  ]
};

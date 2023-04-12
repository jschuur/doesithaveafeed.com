'use client';

import { Field, Form } from 'houseform';
import { pick } from 'lodash';
import { useContext, useEffect } from 'react';

import Button from '~/components/Button';
import useFeedCheck from '~/hooks/useFeedCheck';
import useGetSearchParams from '~/hooks/useGetSearchParams';

import { defaultLookupOptions } from '~/config';
import { LookupContext } from '~/store';
import { FeedCheckParams } from '~/types';

export default function LookupForm() {
  const params = useGetSearchParams();
  const { url, lucky, scanForFeeds, scanAll } = params;

  const { lookupStatus } = useContext(LookupContext);
  const { check } = useFeedCheck();

  useEffect(() => {
    // TODO: improve TypeScript implementation
    if (lucky && url) check({ ...defaultLookupOptions, ...params } as FeedCheckParams);
  }, [check, params, lucky, url]);

  return (
    <div className='w-full md:min-w-[640px] md:w-1/2'>
      <Form
        onSubmit={(values) => {
          check({ url: values.url.trim(), ...pick(values, ['scanForFeeds', 'scanAll']) });
        }}
      >
        {({ isValid, submit }) => (
          <form
            className='pb-6 md:pb-10'
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className='flex items-center justify-center gap-2'>
              <Field name='url' initialValue={url} resetWithValue=''>
                {({ value, setValue, errors }) => {
                  return (
                    <input
                      className='w-full px-2 py-1 border border-gray-300 rounded md:p-2'
                      autoFocus
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={'URL to scan for syndication feeds...'}
                    />
                  );
                }}
              </Field>
              <Button disabled={!isValid} loading={lookupStatus === 'in_progress'} type='submit'>
                {lookupStatus === 'in_progress' ? 'Checking' : 'Lookup'}
              </Button>
            </div>
            <div className='flex pt-2 pl-1'>
              <Field
                name='scanForFeeds'
                initialValue={scanForFeeds || defaultLookupOptions.scanForFeeds}
              >
                {({ value, setValue }) => {
                  return (
                    <div className='flex items-center mr-4'>
                      <input
                        id='scan_for_feeds_checkbox'
                        className='w-5 h-5 text-white bg-gray-100 border-gray-300 rounded accent-indigo-300'
                        type='checkbox'
                        checked={value}
                        onChange={(e) => setValue(e.target.checked)}
                      />
                      <label htmlFor='scan_for_feeds_checkbox' className='ml-2'>
                        Find first in{' '}
                        <a href='https://github.com/jschuur/doesithaveafeed.com/blob/main/src/settings.ts'>
                          common
                        </a>{' '}
                        paths
                      </label>
                    </div>
                  );
                }}
              </Field>

              <Field name='scanAll' initialValue={scanAll || defaultLookupOptions.scanAll}>
                {({ value, setValue }) => {
                  return (
                    <div className='flex items-center mr-4'>
                      <input
                        id='scan_all_checkbox'
                        className='w-5 h-5 border-gray-300 rounded bg-gray-100e accent-indigo-300'
                        type='checkbox'
                        checked={value}
                        onChange={(e) => setValue(e.target.checked)}
                      />
                      <label htmlFor='scan_all_checkbox' className='ml-2'>
                        Find all
                      </label>
                    </div>
                  );
                }}
              </Field>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
}

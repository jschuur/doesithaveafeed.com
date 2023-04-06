'use client';

import { boolean } from 'boolean';
import { Field, Form, FormInstance } from 'houseform';
import { pick } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Button from './Button';
import FeedList from './FeedList';

import useFeedCheck from '../hooks/useFeedCheck';
import { defaultLookupOptions } from '../settings';

export default function FeedLookup() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  const lucky = boolean(searchParams.get('lucky'));

  const formRef = useRef<FormInstance>(null);
  const [url, setUrl] = useState<string>('');

  const { feedUrls, isChecking, error, check } = useFeedCheck();

  useEffect(() => {
    if (lucky && initialUrl) {
      check(initialUrl, defaultLookupOptions, formRef, setUrl);
    }
  }, [lucky, initialUrl, check]);

  return (
    <div className='w-full md:min-w-[640px] md:w-1/2'>
      <Form
        ref={formRef}
        onSubmit={(values) => {
          check(values.url.trim(), pick(values, ['scanForFeeds', 'scanAll']), formRef, setUrl);
        }}
      >
        {({ isValid, submit }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className='flex justify-center items-center gap-2'>
              <Field name='url' initialValue={initialUrl} resetWithValue=''>
                {({ value, setValue, errors }) => {
                  return (
                    <input
                      className='border border-gray-300 rounded px-2 py-1 md:p-2 w-full'
                      autoFocus
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={'URL'}
                    />
                  );
                }}
              </Field>
              <Button disabled={!isValid} loading={isChecking} type='submit'>
                {isChecking ? 'Checking' : 'Lookup'}
              </Button>
            </div>
            <div className='pt-2 pl-1 flex'>
              <Field name='scanForFeeds' initialValue={defaultLookupOptions.scanForFeeds}>
                {({ value, setValue }) => {
                  return (
                    <div className='flex items-center mr-4'>
                      <input
                        id='scan_for_feeds_checkbox'
                        className='w-5 h-5 bg-gray-100 text-sky-400 border-gray-300 rounded'
                        type='checkbox'
                        checked={value}
                        onChange={(e) => setValue(e.target.checked)}
                      />
                      <label htmlFor='scan_for_feeds_checkbox' className='ml-2'>
                        Check{' '}
                        <a href='https://github.com/jschuur/doesithaveafeed.com/blob/main/src/settings.ts'>
                          common
                        </a>{' '}
                        paths
                      </label>
                    </div>
                  );
                }}
              </Field>

              <Field name='scanAll' initialValue={defaultLookupOptions.scanAll}>
                {({ value, setValue }) => {
                  return (
                    <div className='flex items-center mr-4'>
                      <input
                        id='scan_all_checkbox'
                        className='w-5 h-5 bg-gray-100 text-sky-400 border-gray-300 rounded'
                        type='checkbox'
                        checked={value}
                        onChange={(e) => setValue(e.target.checked)}
                      />
                      <label htmlFor='scan_all_checkbox' className='ml-2'>
                        Find all matches
                      </label>
                    </div>
                  );
                }}
              </Field>
            </div>
          </form>
        )}
      </Form>

      <FeedList feedUrls={feedUrls} error={error} isChecking={isChecking} siteUrl={url} />
    </div>
  );
}

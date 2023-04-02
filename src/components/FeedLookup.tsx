'use client';

import { Field, Form, FormInstance } from 'houseform';
import { useRef, useState } from 'react';

import FeedList from '~/components/FeedList';
import useFeedCheck from '~/hooks/useFeedCheck';
import { defaultLookupOptions } from '~/settings';
import { LookupOptions } from '~/types';

export default function FeedLookup() {
  const [url, setUrl] = useState<string>('');
  const [options, setOptions] = useState<LookupOptions>({ scanAll: false, scanForFeeds: true });
  const formRef = useRef<FormInstance>(null);
  const { feedUrls, isChecking, error } = useFeedCheck(url, options, formRef);

  return (
    <div className='pt-6 md:pt-8 w-full md:min-w-[640px] md:w-1/2'>
      <Form
        ref={formRef}
        onSubmit={(values) => {
          setUrl(values.url.trim());
          setOptions({
            scanForFeeds: values.scanForFeeds,
            scanAll: values.scanAll,
          });
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
              <Field name='url'>
                {({ value, setValue, errors }) => {
                  return (
                    <input
                      className='border border-gray-300 rounded p-1 md:p-2 w-full'
                      autoFocus
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={'URL'}
                    />
                  );
                }}
              </Field>
              <button
                disabled={!isValid}
                className='border border-gray-300 px-3 md:px-4 py-1.5 md:py-2 rounded bg-sky-400 text-sm md:text-base text-white'
                type='submit'
              >
                Lookup
              </button>
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
                        Check common paths
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
                        Exhaustive search
                      </label>
                    </div>
                  );
                }}
              </Field>
            </div>
          </form>
        )}
      </Form>

      <FeedList feedUrls={feedUrls} isChecking={isChecking} error={error} siteUrl={url} />
    </div>
  );
}

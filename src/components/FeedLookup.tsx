'use client';

import { Field, Form, FormInstance } from 'houseform';
import { pick } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import Button from '~/components/Button';
import FeedList from '~/components/FeedList';

import useFeedCheck from '~/hooks/useFeedCheck';
import { defaultLookupOptions } from '~/settings';

type Props = {
  initialUrl?: string;
  lucky?: boolean;
};

export default function FeedLookup({ initialUrl, lucky }: Props) {
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
              {/* TODO set resetWithValue better with an actual empty string if houseform allows */}
              <Field name='url' initialValue={initialUrl} resetWithValue=' '>
                {({ value, setValue, errors }) => {
                  return (
                    <input
                      className='border border-gray-300 rounded px-2 py-1 md:p-2 w-full'
                      autoFocus
                      // TODO: remove when resetWithValue is fixed
                      value={value?.trim()}
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

      <FeedList feedUrls={feedUrls} error={error} siteUrl={url} />
    </div>
  );
}

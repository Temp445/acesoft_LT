import React from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { useTranslations } from 'next-intl';

const Count: React.FC = () => {
  const t = useTranslations('Hero');
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.7,
  })

  return (
    <div ref={ref}>
      <div className="mt-2 flex justify-evenly text-center gap-8 lg:mt-0 bg-blue-200 py-8 mx-auto px-5 rounded-xl">
        <div>
          <p className="text-xl font-bold lg:text-5xl text-gray-800 overflow-hidden">
            {inView && <CountUp key={inView.toString()} start={0} end={300} duration={5} />}+
          </p>
          <p className="text-gray-600 font-normal text-sm lg:text-xl mr-2">{t('count.clients')}</p>
        </div>
        <div>
          <p className="text-xl font-bold lg:text-5xl overflow-hidden">
            {inView && <CountUp key={inView.toString()} start={0} end={20} duration={5} />}+
          </p>
          <p className="text-gray-600 font-normal text-sm lg:text-xl mr-2">{t('count.years')}</p>
        </div>
        <div>
          <p className="text-xl font-bold lg:text-5xl overflow-hidden">
            {inView && <CountUp key={inView.toString()} start={0} end={500} duration={5} />}+
          </p>
          <p className="text-gray-600 font-normal text-sm lg:text-xl mr-2">{t('count.projects')}</p>
        </div>
      </div>
    </div>
  )
}

export default Count

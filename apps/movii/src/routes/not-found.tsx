import { useNavigate } from 'react-router';

import notFoundImage from '@/assets/images/404.webp';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-(--color-background) h-screen flex flex-col justify-center items-center">
      <img src={notFoundImage} alt="404 Not Found" className="w-[260px] h-[195px]" loading="lazy" />
      <h3 className="text-2xl text-white mt-12 mb-4 font-bold">요청하신 페이지를 찾을 수 없어요</h3>
      <p className="text-white text-[16px] leading-[22px] mb-10">
        여기에 당신과 저 빼고는 아무도 없는 것 같아요
      </p>
      <button
        className="bg-(--color-primary10) text-white py-2 rounded px-[100px] pt-[7px] pb-2.5"
        onClick={() => navigate('/')}
      >
        왓챠 구독으로 가기
      </button>
    </div>
  );
};

export default NotFound;

import DeleteIcon from '@movii/icons/delete';
import { LogoIcon } from '@movii/icons/logo';
import { SearchIcon } from '@movii/icons/search';
import { debounce } from 'radash';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';

type SearchFormData = {
  query: string;
};

const SearchBarButton = () => {
  const navigate = useNavigate();
  const handleSearchButtonClick = () => {
    navigate('/search');
  };
  return (
    <button
      onClick={handleSearchButtonClick}
      className="w-[286px] bg-(--color-background50) flex items-center gap-2 py-2 px-3 rounded-lg"
    >
      <SearchIcon className="fill-(--color-tertiary-text) size-5" />
      <span className="text-(--color-gray50) text-[15px] text-left flex-1">
        콘텐츠, 태그, 인물, 리스트 검색
      </span>
    </button>
  );
};

const SearchBarInput = () => {
  const navigate = useNavigate();
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const { register, handleSubmit, setValue } = useForm<SearchFormData>({
    defaultValues: {
      query: '',
    },
  });

  const onSubmit = (data: SearchFormData) => {
    const value = data.query.trim();
    if (value) {
      navigate(`/search?query=${encodeURIComponent(value)}`);
    } else {
      navigate('/search');
    }
  };

  const debouncedNavigate = debounce({ delay: 1000 }, (value: string) => {
    onSubmit({ query: value });
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (deleteButtonRef.current) {
      deleteButtonRef.current.style.visibility = value.length > 0 ? 'visible' : 'hidden';
    }
    debouncedNavigate(value);
  };

  const inputFocusRef = useRef<HTMLInputElement>(null);

  const { ref: registerRef, ...queryRegister } = register('query', {
    onChange: handleInputChange,
  });

  const combinedInputRef = (node: HTMLInputElement | null) => {
    registerRef(node);
    inputFocusRef.current = node;
    if (node) {
      node.focus();
    }
  };

  const handleClearQuery = () => {
    setValue('query', '');
    if (deleteButtonRef.current) {
      deleteButtonRef.current.style.visibility = 'hidden';
    }
    debouncedNavigate('');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[286px]">
      <label className="bg-(--color-background50) flex items-center gap-2 py-2 px-3 rounded-lg">
        <SearchIcon className="fill-(--color-tertiary-text) size-5 shrink-0" />
        <input
          {...queryRegister}
          ref={combinedInputRef}
          className="text-(--color-primary-text) placeholder:text-(--color-gray50) text-[15px] w-full outline-none bg-transparent caret-(--color-primary10) "
          placeholder="콘텐츠, 태그, 인물, 리스트 검색"
          type="search"
          autoComplete="off"
        />
        <button
          ref={deleteButtonRef}
          type="button"
          onClick={handleClearQuery}
          className="invisible"
        >
          <DeleteIcon className="fill-(--color-tertiary-text) size-5" />
        </button>
      </label>
    </form>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="px-10 py-3 h-[72px] flex justify-between items-center bg-(--color-background)">
      <button onClick={() => navigate('/')}>
        <LogoIcon className="w-[88px] h-[26px]" />
      </button>
      {location.pathname === '/search' ? <SearchBarInput /> : <SearchBarButton />}
    </div>
  );
};

export default Header;

import { useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoards, selectBoardPage, selectBoardHasMore, selectBoardLoading } from '../../../store/boardSlice';

export const useBoardPagination = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectBoardPage);
  const hasMore = useSelector(selectBoardHasMore);
  const loading = useSelector(selectBoardLoading);

  const observer = useRef();
  const lastBoardRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchBoards({ page: page + 1 }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch]
  );

  return { lastBoardRef, page, hasMore, loading };
};

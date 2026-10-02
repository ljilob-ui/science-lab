import { createClient } from '@supabase/supabase-js';
import { Post, Score } from '../types';

// Read environment variables (supports Vite, Next, and Vercel Supabase integration defaults)
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Mock Posts for Middle School Science Teachers
const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: '🧪 [중3 과학] 산·염기 중화반응 뷰렛 적정 실험 수업 지도안 공유',
    content: 'BTB 용액과 페놀프탈레인 지시약을 혼합하여 중화점 부근에서의 미세한 색상 변화를 관찰하는 학생 참여형 탐구 활동지입니다. 중화열 측정 그래프와 이온수 변화 모형을 함께 제시하면 학생들이 매우 직관적으로 이해합니다.',
    author: '김민준 과학교사',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    likes: 24,
    category: '화학'
  },
  {
    id: 'post-2',
    title: '🌊 [중2 과학] 다층 액체(식용유-물-글리세린)를 이용한 밀도와 부력 탐구',
    content: '서로 섞이지 않는 세 가지 액체의 밀도 차이를 이용해 다양한 물체(나무, 플라스틱, 쇠구슬)의 뜨고 가라앉는 평형 위치를 예측해보는 실험입니다. 아르키메데스의 원리를 시각화하기에 아주 효과적입니다.',
    author: '이서연 수석교사',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    likes: 38,
    category: '물리'
  },
  {
    id: 'post-3',
    title: '⚡ [중2 과학] 옴의 법칙 가상 회로 설계 및 전구 밝기 비교 실습 팁',
    content: '전압(V)과 저항(R)을 슬라이더로 조절하며 실시간 전류(I)의 변화 및 전자 이동 속도를 시뮬레이션으로 보여주니, 눈에 보이지 않던 전기의 흐름을 학생들이 쉽게 이해합니다. 단락(합선) 방지 퓨즈 시뮬레이션도 포함되어 있습니다.',
    author: '박진우 교사',
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    likes: 45,
    category: '물리'
  },
  {
    id: 'post-4',
    title: '🌈 [중1 과학] 빛의 반사와 굴절 - 레이저 입사각과 스넬의 법칙 수업',
    content: '공기에서 물/유리로 빛이 진행할 때 꺾이는 굴절각과, 임계각을 넘어설 때 나타나는 전반사(광통신 원리)를 레이저 궤적으로 관찰하는 디지털 교구입니다. 스마트보드에 띄우고 직접 각도를 조작해보게 하면 집중도가 뛰어납니다.',
    author: '정다은 교사',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    likes: 52,
    category: '물리'
  }
];

// Initial Leaderboard Scores
const INITIAL_SCORES: Score[] = [
  {
    id: 'score-1',
    nickname: '아인슈타인 꿈나무',
    score: 100,
    played_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    quiz_name: '중등 과학 마스터 챌린지'
  },
  {
    id: 'score-2',
    nickname: '퀴리부인2세',
    score: 95,
    played_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    quiz_name: '중등 과학 마스터 챌린지'
  },
  {
    id: 'score-3',
    nickname: '실험실 박사',
    score: 90,
    played_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    quiz_name: '중등 과학 마스터 챌린지'
  },
  {
    id: 'score-4',
    nickname: '뉴턴의 사과',
    score: 85,
    played_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    quiz_name: '중등 과학 마스터 챌린지'
  },
  {
    id: 'score-5',
    nickname: '빛과 소금',
    score: 80,
    played_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    quiz_name: '중등 과학 마스터 챌린지'
  }
];

// Local Storage Keys
const LOCAL_POSTS_KEY = 'science_lab_posts_v1';
const LOCAL_SCORES_KEY = 'science_lab_scores_v1';

export async function fetchPosts(): Promise<Post[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchPosts failed, falling back to local:', e);
    }
  }

  const stored = localStorage.getItem(LOCAL_POSTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(INITIAL_POSTS));
  return INITIAL_POSTS;
}

export async function createPost(newPost: Omit<Post, 'id' | 'created_at' | 'likes'>): Promise<Post> {
  const post: Post = {
    id: 'post-' + Date.now(),
    created_at: new Date().toISOString(),
    likes: 0,
    ...newPost
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select()
        .single();
      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase createPost failed, falling back to local:', e);
    }
  }

  const posts = await fetchPosts();
  const updated = [post, ...posts];
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(updated));
  return post;
}

export async function likePost(id: string): Promise<number> {
  const posts = await fetchPosts();
  const target = posts.find(p => p.id === id);
  if (!target) return 0;
  
  const newLikes = target.likes + 1;
  target.likes = newLikes;

  if (supabase) {
    try {
      await supabase
        .from('posts')
        .update({ likes: newLikes })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase likePost failed:', e);
    }
  }

  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  return newLikes;
}

export async function fetchScores(): Promise<Score[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetchScores failed, falling back to local:', e);
    }
  }

  const stored = localStorage.getItem(LOCAL_SCORES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(INITIAL_SCORES));
  return INITIAL_SCORES;
}

export async function submitScore(nickname: string, score: number, quiz_name = '중등 과학 마스터 챌린지'): Promise<Score> {
  const entry: Score = {
    id: 'score-' + Date.now(),
    nickname,
    score,
    played_at: new Date().toISOString(),
    quiz_name
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .insert([entry])
        .select()
        .single();
      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase submitScore failed, falling back to local:', e);
    }
  }

  const scores = await fetchScores();
  const updated = [...scores, entry].sort((a, b) => b.score - a.score).slice(0, 20);
  localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(updated));
  return entry;
}

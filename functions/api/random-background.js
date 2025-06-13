export async function onRequest(context) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // 高质量可靠的Unsplash图片（25张不重复的图片）
  const backgrounds = [
    // 自然风景图片 - 山脉和森林
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    // 海洋和海滩
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    // 湖泊和河流
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1464822759844-d150baec3014?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    // 天空和云彩
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    // 新增的高质量图片
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1418065460487-3956c3043904?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    // 可靠的CSS渐变背景（确保总有备用方案）
    {
      type: 'gradient',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      type: 'gradient', 
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      type: 'gradient',
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      type: 'gradient',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      type: 'gradient',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      type: 'gradient',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
      type: 'gradient',
      background: 'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)'
    },
    {
      type: 'gradient',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      type: 'gradient',
      background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    }
  ];
  
  // Select a random background
  const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  
  return new Response(JSON.stringify(randomBackground), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...corsHeaders,
    },
  });
} 
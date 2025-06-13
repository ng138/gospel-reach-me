export async function onRequest(context) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 精选纯自然风景图片集合 - 删除所有非风景内容
  const backgrounds = [
    // 山脉风景
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
    // 森林和自然
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
      url: 'https://images.unsplash.com/photo-1501761098459-44421618aaa0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    // 日出日落
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516569424565-9f3ca1e57a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    // 更多自然风景
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1474524955719-b9f87c50ce47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1458501534264-7d326fa0ca04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1450824726818-161bc5c9b8c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1443632864897-14973fa006cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1440066197861-6d4fbee7a4ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1435224654926-ecc9f7fa028c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1429734956993-8a9b0555e122?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1423753231979-b0c652935020?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
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
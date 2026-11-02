"""Get seven independently licensed Pexels originals for a locally hosted demo.
Never disguise HTML or synthetic frames as downloaded MP4 footage.
Run: python scripts/descargar_videos.py
"""
import json, sys, shutil, urllib.request
from pathlib import Path
root=Path(__file__).resolve().parents[1]
items=json.loads((root/'VIDEO_SOURCES.json').read_text('utf-8'))
folder=root/'public/assets/video';folder.mkdir(parents=True,exist_ok=True)
headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36', 'Accept':'video/mp4,application/octet-stream,*/*'}

def validate(path):
 try:
  with path.open('rb') as f:return path.stat().st_size>30000 and b'ftyp' in f.read(64)
 except Exception:return False

def download(item,dest):
 partial=dest.with_suffix('.partial')
 urls=[f"https://www.pexels.com/download/video/{item['videoId']}/?w=960&h=540",f"https://www.pexels.com/download/video/{item['videoId']}/"]
 for u in urls:
  try:
   with urllib.request.urlopen(urllib.request.Request(u,headers=headers),timeout=28) as response,partial.open('wb') as fout:
    first=response.read(128)
    if b'ftyp' not in first[:64]:raise ValueError('URL returned a webpage, not a video')
    fout.write(first)
    shutil.copyfileobj(response,fout,length=1024*1024)
   if not validate(partial):raise ValueError('Invalid MP4 or too small')
   partial.replace(dest)
   return True
  except Exception as ex:print('  Error:',str(ex)[:160])
  finally:partial.unlink(missing_ok=True)
 return False

def update_manifest():
 ok=[item['id'] for item in items if validate(folder/(item['id']+'.mp4'))]
 (folder/'manifest.json').write_text(json.dumps(ok,indent=2)+'\n','utf-8')
 mirror=root/'assets/video';mirror.mkdir(parents=True,exist_ok=True)
 for f in mirror.glob('*.mp4'):f.unlink()
 for id in ok:shutil.copy2(folder/(id+'.mp4'),mirror/(id+'.mp4'))
 shutil.copy2(folder/'manifest.json',mirror/'manifest.json')
 return ok

if '--rebuild-only' not in sys.argv:
 for item in items:
  dest=folder/(item['id']+'.mp4')
  if validate(dest):print('OK',dest.name,'(saved previously)');continue
  print('Pexels:',item['id'], '->',dest.name)
  if download(item,dest):print('  Video real saved:',round(dest.stat().st_size/1024/1024,2),'MB')
  else:print('  Download manually:',item['source'],'save as',dest.name)
ok=update_manifest()
print('Installed real MP4 videos:',len(ok),'of',len(items))
print('To play all seven without internet, place the missing .mp4 files in public/assets/video and run with --rebuild-only.')

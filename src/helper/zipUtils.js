import JSZip from 'jszip';

export async function extractZip(blob) {
  const zip = await JSZip.loadAsync(blob);
  return zip;
}

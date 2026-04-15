import React, { useState, useRef } from 'react';
import { analyzeImage, generateAudio } from '../lib/gemini';
import { saveRecord } from '../lib/storage';
import Markdown from 'react-markdown';
import { Loader2, Upload, Image as ImageIcon, AlertCircle, X, Volume2, MapPin, Printer } from 'lucide-react';

export default function ImageDiagnosis({ isOffline }: { isOffline: boolean }) {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    if (isOffline) {
      setError('You are currently offline. Please connect to the internet to use the AI Image Diagnosis.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');
    setAudioUrl(null);

    try {
      const response = await analyzeImage(image, mimeType, context);
      setResult(response);
      saveRecord({
        type: 'image',
        input: context || 'Image analysis',
        imageUrl: image,
        result: response,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the image.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!result || audioUrl) return;
    
    setLoadingAudio(true);
    try {
      const base64Audio = await generateAudio(result);
      if (base64Audio) {
        const url = `data:audio/wav;base64,${base64Audio}`;
        setAudioUrl(url);
      }
    } catch (err: any) {
      setError('Failed to generate audio: ' + err.message);
    } finally {
      setLoadingAudio(false);
    }
  };

  const handleFindClinics = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        window.open(`https://www.google.com/maps/search/hospitals+clinics/@${latitude},${longitude},13z`, '_blank');
      }, () => {
        window.open(`https://www.google.com/maps/search/hospitals+clinics+near+me`, '_blank');
      });
    } else {
      window.open(`https://www.google.com/maps/search/hospitals+clinics+near+me`, '_blank');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 no-print">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Image-based Diagnosis</h2>
        <p className="text-gray-500 mb-6">Upload an image of a skin condition, injury, or other visible symptom for AI analysis.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-colors"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Click to upload image</h3>
              <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src={image} alt="Uploaded symptom" className="w-full max-h-[400px] object-contain" />
              <button
                type="button"
                onClick={() => { setImage(null); setResult(''); setAudioUrl(null); }}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white hover:text-red-600 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Context (Optional)</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="How long have you had this? Does it itch or hurt?"
                className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !image || isOffline}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              {loading ? 'Analyzing Image...' : 'Analyze Image'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 no-print">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="print-section">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analysis Result</h3>
            </div>
            
            <div className="prose prose-teal max-w-none">
              <Markdown>{result}</Markdown>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-3 mt-6 no-print">
            {!audioUrl ? (
              <button 
                onClick={handlePlayAudio}
                disabled={loadingAudio}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-teal-50 text-teal-700 px-4 py-3 rounded-xl font-medium hover:bg-teal-100 transition-colors"
              >
                {loadingAudio ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                {loadingAudio ? 'Generating Audio...' : 'Listen to Result'}
              </button>
            ) : (
              <div className="flex-1 min-w-[140px] flex items-center justify-center bg-teal-50 rounded-xl px-4 py-2">
                <audio controls autoPlay className="w-full h-10">
                  <source src={audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            <button 
              onClick={handleFindClinics} 
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-medium hover:bg-blue-100 transition-colors"
            >
              <MapPin className="w-5 h-5" /> Nearby Clinics
            </button>
            
            <button 
              onClick={() => window.print()} 
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <Printer className="w-5 h-5" /> Save / Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

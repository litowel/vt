import React, { useState } from 'react';
import { HeartPulse, Flame, Activity, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const emergencyGuides = [
  {
    id: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    icon: <HeartPulse className="w-6 h-6 text-red-500" />,
    content: (
      <div className="space-y-3 text-gray-700">
        <p className="font-medium text-red-600">Call emergency services immediately before starting CPR.</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Check the scene and the person.</strong> Make sure it is safe. Tap the shoulder and shout, "Are you OK?"</li>
          <li><strong>Call 911</strong> or your local emergency number.</li>
          <li><strong>Open the airway.</strong> Lay the person on their back and tilt their head back slightly.</li>
          <li><strong>Check for breathing.</strong> Listen for no more than 10 seconds.</li>
          <li><strong>Push hard, push fast.</strong> Place your hands, one on top of the other, in the middle of the chest. Use your body weight to help you administer compressions that are at least 2 inches deep and delivered at a rate of 100 to 120 compressions a minute.</li>
          <li><strong>Deliver rescue breaths.</strong> (If trained) With the head tilted back slightly and the chin lifted, pinch the nose shut and place your mouth fully over the person's mouth. Blow to make the chest rise.</li>
          <li><strong>Continue CPR steps.</strong> Keep performing cycles of chest compressions and breathing until the person exhibits signs of life or EMS arrives.</li>
        </ol>
      </div>
    )
  },
  {
    id: 'choking',
    title: 'Choking (Heimlich Maneuver)',
    icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    content: (
      <div className="space-y-3 text-gray-700">
        <p className="font-medium text-amber-600">If the person is coughing forcefully, encourage them to keep coughing. If they cannot breathe, cough, or speak, take action.</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Stand behind the person.</strong> Place one foot slightly in front of the other for balance.</li>
          <li><strong>Make a fist with one hand.</strong> Grasp it with the other hand.</li>
          <li><strong>Place your fist slightly above the person's navel.</strong></li>
          <li><strong>Press hard into the abdomen</strong> with a quick, upward thrust — as if trying to lift the person up.</li>
          <li><strong>Perform between six and 10 abdominal thrusts</strong> until the blockage is dislodged.</li>
        </ol>
      </div>
    )
  },
  {
    id: 'burns',
    title: 'Burns',
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    content: (
      <div className="space-y-3 text-gray-700">
        <p className="font-medium text-orange-600">For severe or large burns, call emergency services immediately.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Cool the burn.</strong> Hold the burned area under cool (not cold) running water or apply a cool, wet compress until the pain eases. Do not use ice.</li>
          <li><strong>Remove rings or other tight items</strong> from the burned area quickly and gently, before the area swells.</li>
          <li><strong>Don't break blisters.</strong> Fluid-filled blisters protect against infection. If a blister breaks, clean the area with water (mild soap is optional).</li>
          <li><strong>Apply lotion.</strong> Once a burn is completely cooled, apply a lotion, such as one that contains aloe vera or a moisturizer.</li>
          <li><strong>Bandage the burn.</strong> Cover the burn with a sterile gauze bandage (not fluffy cotton). Wrap it loosely to avoid putting pressure on burned skin.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    icon: <Activity className="w-6 h-6 text-red-600" />,
    content: (
      <div className="space-y-3 text-gray-700">
        <p className="font-medium text-red-600">Call emergency services immediately for severe bleeding.</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Remove any clothing or debris</strong> on the wound. Don't remove large or deeply embedded objects.</li>
          <li><strong>Stop the bleeding.</strong> Place a sterile bandage or clean cloth on the wound. Press the bandage firmly with your palm to control bleeding.</li>
          <li><strong>Help the injured person lie down.</strong> If possible, elevate the legs or position the head lower than the trunk.</li>
          <li><strong>Don't remove the gauze or bandage.</strong> If the bleeding seeps through the gauze or other cloth on the wound, add another bandage on top of it. And keep pressing firmly on the area.</li>
          <li><strong>Immobilize the injured body part</strong> once the bleeding has stopped. Leave the bandages in place and get the injured person to the emergency room as soon as possible.</li>
        </ol>
      </div>
    )
  }
];

export default function FirstAid() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleGuide = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">First Aid & Emergency</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Quick reference guides for common medical emergencies. <strong className="text-red-600">Always call your local emergency services (e.g., 911) first in a life-threatening situation.</strong>
        </p>
      </div>

      <div className="space-y-4">
        {emergencyGuides.map((guide) => (
          <div key={guide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleGuide(guide.id)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-50 rounded-xl">
                  {guide.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
              </div>
              {openId === guide.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {openId === guide.id && (
              <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                {guide.content}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
        <p className="text-blue-800 font-medium">
          These guides are available offline. You can access them anytime, even without an internet connection.
        </p>
      </div>
    </div>
  );
}

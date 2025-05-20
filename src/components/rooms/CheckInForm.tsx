import React, { useState } from 'react';
import { X, Upload, UserPlus } from 'lucide-react';
import { Room } from '../../types';

interface Guest {
  name: string;
  phoneNumber: string;
  gender: string;
}

interface CheckInFormProps {
  room: Room;
  availableRooms: Room[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ room, availableRooms, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    address: '',
    phoneNumber: '',
    gender: '',
    roomNumber: room.roomNumber,
    price: room.price,
    numberOfGuests: 1,
    additionalGuests: [] as Guest[],
    idProofType: '',
    idNumber: '',
    idFile: null as File | null,
    vehicleNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        idFile: e.target.files![0],
      }));
    }
  };

  const handleAdditionalGuestChange = (index: number, field: keyof Guest, value: string) => {
    setFormData(prev => {
      const updatedGuests = [...prev.additionalGuests];
      updatedGuests[index] = {
        ...updatedGuests[index],
        [field]: value,
      };
      return {
        ...prev,
        additionalGuests: updatedGuests,
      };
    });
  };

  const addAdditionalGuest = () => {
    setFormData(prev => ({
      ...prev,
      additionalGuests: [
        ...prev.additionalGuests,
        { name: '', phoneNumber: '', gender: '' },
      ],
    }));
  };

  const removeAdditionalGuest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalGuests: prev.additionalGuests.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.roomNumber) {
      newErrors.roomNumber = 'Room number is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.idProofType) {
      newErrors.idProofType = 'Please select an ID proof type';
    }

    if (['Aadhar', 'DL'].includes(formData.idProofType) && !formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    if (!formData.idFile) {
      newErrors.idFile = 'Please upload an ID proof';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare form data for submission
      const submitData = {
        ...formData,
        roomId: room.id,
        checkInDate: new Date().toISOString(),
      };
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Failed to submit check-in form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Guest Check-in</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Primary Guest Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number *
                </label>
                <select
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a room</option>
                  {availableRooms.map((availableRoom) => (
                    <option 
                      key={availableRoom.id} 
                      value={availableRoom.roomNumber}
                    >
                      Room {availableRoom.roomNumber} - {availableRoom.type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {errors.roomNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.roomNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter price"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Name *
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.guestName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter guest name"
                />
                {errors.guestName && (
                  <p className="mt-1 text-sm text-red-500">{errors.guestName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  min="1"
                  max="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter complete address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Additional Guests Section */}
            {formData.numberOfGuests > 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">Additional Guests</h3>
                  <button
                    type="button"
                    onClick={addAdditionalGuest}
                    className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    <UserPlus size={16} className="mr-1" />
                    Add Guest
                  </button>
                </div>

                {formData.additionalGuests.map((guest, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">Guest {index + 2}</h4>
                      <button
                        type="button"
                        onClick={() => removeAdditionalGuest(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={guest.name}
                          onChange={(e) => handleAdditionalGuestChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter guest name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={guest.phoneNumber}
                          onChange={(e) => handleAdditionalGuestChange(index, 'phoneNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={guest.gender}
                          onChange={(e) => handleAdditionalGuestChange(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ID Proof Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Proof Type *
                </label>
                <select
                  name="idProofType"
                  value={formData.idProofType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.idProofType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select ID proof type</option>
                  <option value="Aadhar">Aadhar Card</option>
                  <option value="DL">Driving License</option>
                  <option value="Other">Other</option>
                </select>
                {errors.idProofType && (
                  <p className="mt-1 text-sm text-red-500">{errors.idProofType}</p>
                )}
              </div>

              {['Aadhar', 'DL'].includes(formData.idProofType) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.idNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter ID number"
                  />
                  {errors.idNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.idNumber}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload ID Proof *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="idFile"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="idFile"
                        name="idFile"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
              {errors.idFile && (
                <p className="mt-1 text-sm text-red-500">{errors.idFile}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number (Optional)
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter vehicle number"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Complete Check-in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckInForm; 